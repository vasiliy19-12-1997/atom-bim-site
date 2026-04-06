import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoMainSections, VideoSoftware, VideoType } from '@/entities/Video';
import { classNames } from '@/shared/lib/classNames/classNames';
import { TabItem, Tabs } from '@/shared/ui/redesigned/Tabs';

type TabItemType = VideoType | VideoMainSections | VideoSoftware;

interface VideoPageTabsProps {
    className?: string;
    value: TabItemType;
    onChangeType: (value: TabItemType) => void;
}

export const VideoPageTabs = memo((props: VideoPageTabsProps) => {
    const { className, value, onChangeType } = props;
    const { t } = useTranslation();

    const tabs = useMemo<TabItem[]>(
        () => [
            { value: VideoType.ALL, content: t('Все типы') },
            { value: VideoType.VIDEO_INSTRUCTION, content: t('Инструкции') },
            { value: VideoType.WEBINARS, content: t('Вебинары') },
            { value: VideoType.PLUGINS, content: t('Плагины') },
            { value: VideoMainSections.COMMON, content: t('Общие') },
        ],
        [t],
    );

    const onClickTab = useCallback(
        (tab: TabItem) => {
            onChangeType(tab.value as TabItemType);
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
