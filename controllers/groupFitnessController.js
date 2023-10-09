// Process the response data and filter out specific rooms
const getGroupFitnessSchedule = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const targetUrl = `https://www.seattleymca.org/schedules/get-event-data/Downtown%20Seattle%20YMCA%3BMeredith%20Mathews%20East%20Madison%20YMCA/Strength%3BMind%20Body%3BHIIT%3BCardio/${today}?limit=Cardio%3BCycle%3BDance%3BHIIT%3BMind%20Body%3BStrength%3BWater%20Fitness%3BGroup%20Exercise%20Classes`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.headers['user-agent'],
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        const excludedRooms = ['Downtown Y - 5th Floor Wellness', 'Downtown Y - Racquetball Court 01', 'Downtown Y - Racquetball Court 02', 'Downtown Y - Basketball Gym', 'Meredith Mathews Y - Adventure Zone', 'Meredith Mathews Y - Kids\' Corner']; // Example: Rooms to exclude
        const excludedClasses = ['AOA - Bold & Balanced', 'Personal Training - 60 Minute Sessions', 'Personalized Wellness Plan', 'Personal Training - 30 Minute Sessions', 'Personal Training - Partner', 'Open Gym - All Ages', 'Water Walking', 'Swim Starters - Adult with Child', 'Racquetball Reservation', 'Swim Basics - Youth', 'Swim Basics - Preschool', 'Swim Lessons - Teen Adult Beginner', 'Pilates - Mat', 'Intro to Youth & Government', 'Aqua Fitness', 'Swim Lessons - Teen Adult', 'Yoga - All Levels', 'Yoga - Power Vinyasa', 'Cycle All Levels', 'Pickleball - All Ages', 'Lap Swim', 'Recreational Swim', 'Lap Swim Limited'];

        const filteredData = responseData.filter((item) => {
            const isClassExcluded = excludedClasses.includes(item.name);
            const isRoomExcluded = excludedRooms.includes(item.room);
            return !isClassExcluded && !isRoomExcluded;
        });

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
};

const getGroupFitnessScheduleByDate = async (req, res) => {
    const { date } = req.params;
    const targetUrl = `https://www.seattleymca.org/schedules/get-event-data/Downtown%20Seattle%20YMCA%3BMeredith%20Mathews%20East%20Madison%20YMCA/Strength%3BMind%20Body%3BHIIT%3BCardio/${date}?limit=Cardio%3BCycle%3BDance%3BHIIT%3BMind%20Body%3BStrength%3BWater%20Fitness%3BGroup%20Exercise%20Classes`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.headers['user-agent'],
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        const excludedRooms = ['Downtown Y - 5th Floor Wellness', 'Downtown Y - Racquetball Court 01', 'Downtown Y - Racquetball Court 02', 'Downtown Y - Basketball Gym', 'Meredith Mathews Y - Adventure Zone', 'Meredith Mathews Y - Kids\' Corner']; // Example: Rooms to exclude
        const excludedClasses = ['AOA - Bold & Balanced', 'Personal Training - 60 Minute Sessions', 'Personalized Wellness Plan', 'Personal Training - 30 Minute Sessions', 'Personal Training - Partner', 'Open Gym - All Ages', 'Water Walking', 'Swim Starters - Adult with Child', 'Racquetball Reservation', 'Swim Basics - Youth', 'Swim Basics - Preschool', 'Swim Lessons - Teen Adult Beginner', 'Pilates - Mat', 'Intro to Youth & Government', 'Aqua Fitness', 'Swim Lessons - Teen Adult', 'Yoga - All Levels', 'Yoga - Power Vinyasa', 'Cycle All Levels', 'Pickleball - All Ages', 'Lap Swim', 'Recreational Swim', 'Lap Swim Limited'];
        const filteredData = responseData.filter((item) => {
            const isClassExcluded = excludedClasses.includes(item.name);
            const isRoomExcluded = excludedRooms.includes(item.room);
            return !isClassExcluded && !isRoomExcluded;
        });

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
};

module.exports = {
    getGroupFitnessSchedule,
    getGroupFitnessScheduleByDate
};
