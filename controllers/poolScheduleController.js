const getPoolSchedule = async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const targetUrl = `https://www.seattleymca.org/schedules/get-event-data/Meredith%20Mathews%20East%20Madison%20YMCA/0/${today}?limit=Recreational%20Swim%3BCPR%20%26%20First%20Aid%3BLap%20Swim%20%26%20Water%20Walking%3BLifeguard%20%26%20Swim%20Instructor%20Training%3BPool%20Reservation%3BRecreational%20%26%20Community%20Swim%3BSwim%20Lessons%202%3BSwim%20Team%202%3BSafety%20Around%20Water%202%3BSwim%20Lessons%3BCommunity%20Swim%3BSwim%20Lessons%20-%20Private`;

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
        const excludedClasses = ['Water Walking', 'Swim Starters - Adult with Child', 'Swim Basics - Youth', 'Swim Basics - Preschool', 'Swim Lessons - Teen Adult Beginner', 'Swim Lessons - Teen Adult'];
        const filteredData = responseData.filter((item) => {
            const isClassExcluded = excludedClasses.includes(item.name);
            return !isClassExcluded;
        });

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
};

const getPoolScheduleByDate = async (req, res) => {
    const { date } = req.params;
    const targetUrl = `https://www.seattleymca.org/schedules/get-event-data/Meredith%20Mathews%20East%20Madison%20YMCA/0/${date}?limit=Recreational%20Swim%3BCPR%20%26%20First%20Aid%3BLap%20Swim%20%26%20Water%20Walking%3BLifeguard%20%26%20Swim%20Instructor%20Training%3BPool%20Reservation%3BRecreational%20%26%20Community%20Swim%3BSwim%20Lessons%202%3BSwim%20Team%202%3BSafety%20Around%20Water%202%3BSwim%20Lessons%3BCommunity%20Swim%3BSwim%20Lessons%20-%20Private`;

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
        const excludedClasses = ['Water Walking', 'Swim Starters - Adult with Child', 'Swim Basics - Youth', 'Swim Basics - Preschool', 'Swim Lessons - Teen Adult Beginner', 'Swim Lessons - Teen Adult'];
        const filteredData = responseData.filter((item) => {
            const isClassExcluded = excludedClasses.includes(item.name);
            return !isClassExcluded;
        });

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
};

module.exports = {
    getPoolSchedule,
    getPoolScheduleByDate
};

