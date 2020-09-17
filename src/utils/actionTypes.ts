const randomString = () => Math.random().toString(36).substring(7);
const ns = (s: TemplateStringsArray) => `@@context/${s}/${randomString()}`;

export const ActionTypes = {
    INIT: ns`INIT`,
    PROBE_UNKNOWN_ACTION: ns`PROBE_UNKNOWN_ACTION`,
};
