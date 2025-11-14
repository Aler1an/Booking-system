export function formatError(error, requestId, code = null, details = null) {
    return { error, code, details, requestId };
}
