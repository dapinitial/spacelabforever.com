import time
import board
import adafruit_scd4x
import json
from datetime import datetime
import shutil
import os
import uuid
import sys
from cosmosdb import get_container_client, upsert_item

# Retry configuration
max_retries = 5
retry_wait_time = 5

i2c = board.I2C()
scd4x = adafruit_scd4x.SCD4X(i2c)
print("Serial number:", [hex(i) for i in scd4x.serial_number])

scd4x.start_periodic_measurement()
print("Waiting for first measurement....")

# Specify the file path to save the JSON data
file_path = "sensor_data.json"

# Specify the backup directory path
backup_directory = "backup"
max_files_to_keep = 10

# Retry decorator


def retry(func):
    def wrapper(*args, **kwargs):
        retries = 0
        while retries < max_retries:
            try:
                return func(*args, **kwargs)
            except Exception as ex:
                print(
                    f"Request failed with error: {str(ex)}. Retrying in {retry_wait_time} seconds...")
                time.sleep(retry_wait_time)
                retries += 1
        print(f"Request failed after {max_retries} retries. Exiting...")
        sys.exit(1)
    return wrapper

# Backup and delete old files


def backup_and_delete_old_files():
    # Create the backup directory if it doesn't exist
    if not os.path.exists(backup_directory):
        os.makedirs(backup_directory)

    # Get the current date and time
    current_date = datetime.now().strftime("%Y-%m-%d")

    # Create a backup file name based on the current date and time
    backup_file_name = f"sensor_data_{current_date}.json"

    # Copy the current JSON file to the backup directory
    shutil.copyfile(file_path, os.path.join(
        backup_directory, backup_file_name))

    # Get a list of all JSON files in the backup directory
    files = os.listdir(backup_directory)
    json_files = [file for file in files if file.endswith(".json")]

    # Sort the JSON files based on the modified timestamp (oldest to newest)
    json_files.sort(key=lambda x: os.path.getmtime(
        os.path.join(backup_directory, x)))

    # Delete the old files if the number of files exceeds the maximum limit
    if len(json_files) > max_files_to_keep:
        files_to_delete = json_files[:len(json_files) - max_files_to_keep]
        for file in files_to_delete:
            os.remove(os.path.join(backup_directory, file))

# Transform the sensor data


def transform_data(data):
    # Generate a new unique ID for each sensor reading
    unique_id = str(uuid.uuid4())
    transformed_data = {
        "id": unique_id,
        "temperature": data["temperature"],
        "humidity": data["humidity"],
        "co2": data["co2"],
        "datetime": data["datetime"]
    }
    return transformed_data

# Query and upsert data to Cosmos DB


@retry
def upsert_data_to_cosmos(sensor_data_list):
    container = get_container_client()
    for sensor_data in sensor_data_list:
        container.upsert_item(sensor_data)
    backup_and_delete_old_files()

# Main function


def main():
    sensor_data_list = []  # Initialize an empty list to store sensor data

    while True:
        try:
            if scd4x.data_ready:
                # Read the sensor data once it is ready
                temperature = scd4x.temperature
                humidity = scd4x.relative_humidity
                co2 = scd4x.CO2

                # Get the current date and time
                current_time = datetime.now().isoformat()

                # Create a Python dictionary representing the sensor data with date and time
                sensor_data = {
                    "datetime": current_time,
                    "temperature": temperature,
                    "humidity": humidity,
                    "co2": co2
                }

                print("New sensor data:", sensor_data)

                # Load existing JSON data from the file, if available
                existing_data = {}
                try:
                    with open(file_path, "r") as file:
                        existing_data = json.load(file)
                except FileNotFoundError:
                    pass

                # Update the existing data dictionary with the new sensor data
                existing_data[current_time] = sensor_data

                # Save the updated JSON data to the file
                with open(file_path, "w") as file:
                    json.dump(existing_data, file)

                # Transform the sensor data and append to the list
                transformed_data = transform_data(sensor_data)
                sensor_data_list.append(transformed_data)

                # Upsert the sensor data to Cosmos DB
                upsert_data_to_cosmos([transformed_data])

            time.sleep(30)

        except Exception as ex:
            print(f"An error occurred: {ex}")
            import traceback
            traceback.print_exc()  # This line prints the full exception traceback
            time.sleep(30)


if __name__ == "__main__":
    main()
