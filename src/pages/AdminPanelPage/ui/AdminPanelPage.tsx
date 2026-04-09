import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isUserAdmin } from '@/entities/User';
import { $api } from '@/shared/config/api/api';
import { Button } from '@/shared/ui/redesigned/Button';
import { Text } from '@/shared/ui/redesigned/Text';
import { Page } from '@/shared/ui/deprecated/Page';
import cls from './AdminPanelPage.module.scss';

interface RefreshVideosResponse {
    success: boolean;
    count?: number;
    updatedAt?: number;
    message?: string;
}

interface RefreshInstructionLinksResponse {
    success: boolean;
    count?: number;
    updatedAt?: number;
    message?: string;
}

const AdminPanelPage = memo(() => {
    const { t } = useTranslation();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);
    const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);
    const [isRefreshingInstructionLinks, setIsRefreshingInstructionLinks] = useState(false);
    const [instructionLinksError, setInstructionLinksError] = useState<string | null>(null);
    const [instructionLinksSuccess, setInstructionLinksSuccess] = useState<string | null>(null);
    const canRefreshVideos = useSelector(isUserAdmin);

    const onRefreshVideos = useCallback(async () => {
        setIsRefreshing(true);
        setRefreshError(null);
        setRefreshSuccess(null);

        try {
            const response = await $api.post<RefreshVideosResponse>('/api/videos/rutube/refresh');

            if (response.data.success) {
                const count = response.data.count ?? 0;
                setRefreshSuccess(t('Кеш видео обновлен. Найдено видео: {{count}}', { count }));
            } else {
                setRefreshError(response.data.message || t('Не удалось обновить кеш видео'));
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : t('Не удалось обновить кеш видео');
            setRefreshError(message);
        } finally {
            setIsRefreshing(false);
        }
    }, [t]);

    const onRefreshInstructionLinks = useCallback(async () => {
        setIsRefreshingInstructionLinks(true);
        setInstructionLinksError(null);
        setInstructionLinksSuccess(null);

        try {
            const response = await $api.post<RefreshInstructionLinksResponse>('/api/instructions/links/refresh');

            if (response.data.success) {
                const count = response.data.count ?? 0;
                setInstructionLinksSuccess(t('Кеш инструкций обновлен. Найдено ссылок: {{count}}', { count }));
            } else {
                setInstructionLinksError(response.data.message || t('Не удалось обновить кеш инструкций'));
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : t('Не удалось обновить кеш инструкций');
            setInstructionLinksError(message);
        } finally {
            setIsRefreshingInstructionLinks(false);
        }
    }, [t]);

    return (
        <Page data-testid="AdminPanelPage" className={cls.AdminPanelPage}>
            <Text title={t('AdminPanelPage')} />
            {canRefreshVideos && (
                <>
                    <div className={cls.refreshVideos}>
                        <Button onClick={onRefreshVideos} disabled={isRefreshing}>
                            {isRefreshing ? t('Обновляем видео...') : t('Обновить видео с RuTube')}
                        </Button>
                        {refreshSuccess && <Text text={refreshSuccess} />}
                        {refreshError && <Text variant="error" text={refreshError} />}
                    </div>

                    <div className={cls.refreshVideos}>
                        <Button onClick={onRefreshInstructionLinks} disabled={isRefreshingInstructionLinks}>
                            {isRefreshingInstructionLinks
                                ? t('Обновляем инструкции...')
                                : t('Обновить инструкции из NocoDB')}
                        </Button>
                        {instructionLinksSuccess && <Text text={instructionLinksSuccess} />}
                        {instructionLinksError && <Text variant="error" text={instructionLinksError} />}
                    </div>
                </>
            )}
        </Page>
    );
});

export default AdminPanelPage;
