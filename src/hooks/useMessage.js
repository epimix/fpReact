import { useCallback } from 'react';
import { message } from 'antd';

export function useMessage() {
    const [messageApi, contextHolder] = message.useMessage();

    const showInfo = useCallback((msg) => {
        messageApi.info(msg);
    }, []);

    const showWarning = useCallback((msg) => {
        messageApi.open({
            type: 'warning',
            content: msg,
        });
    }, []);

    const showSuccess = useCallback((msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
        });
    }, []);

    const showError = useCallback((msg) => {
        messageApi.open({
            type: 'error',
            content: msg,
        });
    }, []);

    return {
        contextHolder,
        showInfo,
        showWarning,
        showSuccess,
        showError,
    };
}