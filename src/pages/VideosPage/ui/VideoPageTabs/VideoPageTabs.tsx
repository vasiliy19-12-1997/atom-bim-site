import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoType } from '@/entities/Video';
import { classNames } from '@/shared/lib/classNames/classNames';
import { TabItem, Tabs } from '@/shared/ui/redesigned/Tabs';

interface VideoPageTabsProps {
    className?: string;
    value: VideoType;
    onChangeType: (value: VideoType) => void;
}

export const VideoPageTabs = memo((props: VideoPageTabsProps) => {
    const { className, value, onChangeType } = props;
    const { t } = useTranslation();

    const tabs = useMemo<TabItem[]>(
        () => [
            { value: VideoType.ALL, content: t('All types') },
            { value: VideoType.VIDEO_INSTRUCTION, content: t('Instructions') },
            { value: VideoType.WEBINARS, content: t('Webinars') },
            { value: VideoType.PLUGINS, content: t('Plugins') },
        ],
        [t],
    );

    const onClickTab = useCallback(
        (tab: TabItem) => {
            onChangeType(tab.value as VideoType);
        },
        [onChangeType],
    );

    return (
        <Tabs
            direction="column"
            onTabsClick={onClickTab}
            value={value}
            tabs={tabs}
            className={classNames('', {}, [className])}
        />
    );
});
