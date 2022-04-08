const validateAddComment = (data) => {
    const errors = [];

    if (!data.content) {
        errors.push('content');
    }

    if (!data.name) {
        errors.push('name');
    }

    if (!data.postId) {
        errors.push('postId');
    }

    if (errors.length > 0) {
        if (errors.length === 1) {
            return {
                success: false,
                message: `${errors[0]} is required`
            }
        }

        const lastError = errors.pop();
        return {
            success: false,
            message: `${errors.join(',')} and ${lastError} are required`
        }

    } else {
        return {
            success: true,
            message: ''
        }
    }
}

const validateCreatePost = (data) => {
    const errors = [];

    if (!data.content) {
        errors.push('content');
    }

    if (!data.name) {
        errors.push('name');
    }

    if (!data.title) {
        errors.push('title');
    }

    if (errors.length > 0) {
        if (errors.length === 1) {
            return {
                success: false,
                message: `${errors[0]} is required`
            }
        }

        const lastError = errors.pop();
        return {
            success: false,
            message: `${errors.join(',')} and ${lastError} are required`
        }

    } else {
        return {
            success: true,
            message: ''
        }
    }
}

module.exports = {
    validateAddComment,
    validateCreatePost
}
