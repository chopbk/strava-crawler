const getStartAndEndTimeOfMonth = (month, year) => {
    return {
        startTime: new Date(year, month - 1, 1).toISOString(),
        endTime: new Date(year, month, 1).toISOString(),
    };
};

module.exports = {
    getStartAndEndTimeOfMonth,
};
