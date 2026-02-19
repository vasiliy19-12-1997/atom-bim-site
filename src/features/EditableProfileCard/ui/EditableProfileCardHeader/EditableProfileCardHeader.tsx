import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAuthUserData } from '@/entities/User';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getProfileData } from '../../model/selectors/getProfileData/getProfileData';
import { getProfileReadonly } from '../../model/selectors/getProfileReadonly/getProfileReadonly';
import { updateProfileData } from '../../model/services/updateProfileData/updateProfileData';
import { profileActions } from '../../model/slice/profileSlice';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { Sceleton } from '@/shared/ui/redesigned/Sceleton';

interface EditableProfileCardHeaderProps {
    className?: string;
    isLoading?: boolean;
}

export const EditableProfileCardHeader = memo((props: EditableProfileCardHeaderProps) => {
    const { className, isLoading = false } = props;
    const { t } = useTranslation();
    const readonly = useSelector(getProfileReadonly);
    const authData = useSelector(getAuthUserData);
    const profileData = useSelector(getProfileData);
    const canEdit = authData?.id === profileData?.id;
    const dispatch = useAppDispatch();

    const onEdit = useCallback(() => {
        dispatch(profileActions.setReadonly(false));
    }, [dispatch]);

    const onCancellEdit = useCallback(() => {
        dispatch(profileActions.cancellEdit());
    }, [dispatch]);

    const onSave = useCallback(() => {
        dispatch(updateProfileData());
    }, [dispatch]);

    if (isLoading) {
        return (
            <Card className={classNames('', {}, [className])} border="partial_round" padding="24" max>
                                    <HStack max justify="between">
                                        <Sceleton width={265} height={40} />
                                        <Sceleton width={150} height={40} />
                                    </HStack>
                                </Card>
        );
    }
    return (
        <Card className={classNames('', {}, [className])} border="partial_round" padding="24" max>
                            <HStack max justify="between">
                                <Text title={t('Профиль пользователя')} />
                                {canEdit && (
                                    <div>
                                        {readonly ? (
                                            <Button
                                                variant="outline"
                                                onClick={onEdit}
                                                data-testid="EditableProfileCardHeader.Edit"
                                            >
                                                {t('Редактировать')}
                                            </Button>
                                        ) : (
                                            <HStack max justify="between">
                                                <Button
                                                    color="error"
                                                    variant="outline"
                                                    onClick={onCancellEdit}
                                                    data-testid="EditableProfileCardHeader.Cancel"
                                                >
                                                    {t('Отменить')}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    color="succes"
                                                    onClick={onSave}
                                                    data-testid="EditableProfileCardHeader.Save"
                                                >
                                                    {t('Сохранить')}
                                                </Button>
                                            </HStack>
                                        )}
                                    </div>
                                )}
                            </HStack>
                        </Card>
    );
});
