const randomString = (): string =>
    Math.random().toString(36).substring(7).split("").join(".");

export const ActionTypes = {
    INIT: `@@context/INIT${randomString()}`,
    PROBE_UNKNOWN_ACTION: `@@context/PROBE_UNKNOWN_ACTION${randomString()}`,
};
