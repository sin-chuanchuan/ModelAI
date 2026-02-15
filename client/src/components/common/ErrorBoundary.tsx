import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Result
                        status="error"
                        title="页面出了点小状况"
                        subTitle="非常抱歉，当前页面加载出错。您可以尝试刷新页面或返回工作台。"
                        extra={[
                            <Button type="primary" key="refresh" onClick={() => window.location.reload()}>
                                刷新页面
                            </Button>,
                            <Button key="console" onClick={() => window.location.href = '/projects'}>
                                返回工作台
                            </Button>
                        ]}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
