const randomString = (): string => Math.random().toString(36).substring(7);
const ns = (s: TemplateStringsArray): string =>
    `@@context/${s}/${randomString()}`;

export const ActionTypes = {
    INIT: ns`INIT`,
    PROBE_UNKNOWN_ACTION: ns`PROBE_UNKNOWN_ACTION`,
};
