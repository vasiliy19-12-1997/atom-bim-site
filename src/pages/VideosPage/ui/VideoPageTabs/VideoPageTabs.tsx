import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoFilterType, VideoMainSections, VideoSoftware, VideoType } from '@/entities/Video';
import { classNames } from '@/shared/lib/classNames/classNames';
import { TabItem, Tabs } from '@/shared/ui/redesigned/Tabs';

interface VideoPageTabsProps {
    className?: string;
    value: VideoFilterType;
    onChangeType: (value: VideoFilterType) => void;
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
            { value: VideoSoftware.AUTOCAD, content: t('Autodesk AutoCAD') },
            { value: VideoSoftware.REVIT, content: t('Autodesk Revit') },
            { value: VideoSoftware.TANGL_VALUE, content: t('TANGL') },
            { value: VideoSoftware.CIVIL3D, content: t('Autodesk Civil 3D') },
            { value: VideoMainSections.AR, content: t('АР') },
            { value: VideoMainSections.KR, content: t('КР') },
            { value: VideoMainSections.OV, content: t('ОВ') },
            { value: VideoMainSections.VK, content: t('ВК') },
            { value: VideoMainSections.EL, content: t('ЭЛ') },
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
