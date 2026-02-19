import { memo, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAuthUserMounted, initedAuthData } from '@/entities/User';
import { MainLayout } from '@/shared/layouts/MainLayout';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { PageLoader } from '@/shared/ui/deprecated/PageLoader';
import { Navbar } from '@/widgets/Navbar';
import { Sidebar } from '@/widgets/Sidebar';
import { useAppToolbar } from './lib/useAppToolbar';
import { AppRouter } from './providers/router';
import { withTheme } from './providers/ThemeProvider/ui/withTheme';

const App = memo(() => {
    const auth = useSelector(getAuthUserMounted);
    const dispatch = useAppDispatch();
    const toolbar = useAppToolbar();
    useEffect(() => {
        if (!auth) {
            dispatch(initedAuthData());
        }
    }, [auth, dispatch]);

    if (!auth) {
        return <PageLoader />;
    }

    return (
        <div id="app" className={classNames('app', {}, [])}>
            <Suspense fallback="">
                <MainLayout header={<Navbar />} content={<AppRouter />} sidebar={<Sidebar />} toolbar={toolbar} />
            </Suspense>
        </div>
    );
});

export default withTheme(App);
