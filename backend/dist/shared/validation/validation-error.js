export class ValidationFormatter {
    static formate(error) {
        return error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
}
