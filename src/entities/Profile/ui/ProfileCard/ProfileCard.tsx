import { useTranslation } from 'react-i18next';
import { Country } from '@/entities/Country';
import { Currency } from '@/entities/Currency';
import { Profile } from '../../model/types/profile';


import {
    ProfileCardRedesign,
    ProfileCardRedesignError,
    ProfileCardRedesignSceleton,
} from '../ProfileCardRedesign/ProfileCardRedesign';

interface ProfileCardProps {
    className?: string;
    onChangeFirstname?: (value: string) => void;
    onChangeLastname?: (value: string) => void;
    onChangeAge?: (value: string) => void;
    onChangeCity?: () => void;
    onChangeUsername?: (value: string) => void;
    onChangeAvatar?: (value: string) => void;
    onChangeCurrency?: (value: Currency) => void;
    onChangeCountry?: (value: Country) => void;
    readonly?: boolean;
    id?: string;
    data?: Profile;
    isLoading?: boolean;
    error?: string;
}

export const ProfileCard = (props: ProfileCardProps) => {
    const { t } = useTranslation();

    const {
        className,
        onChangeFirstname,
        onChangeLastname,
        onChangeAge,
        onChangeCity,
        onChangeUsername,
        onChangeAvatar,
        onChangeCurrency,
        onChangeCountry,
        readonly = false,
        id = '1',
        data,
        isLoading,
        error,
    } = props;
    // TODO сделать чтобы лоадер скелетон отображался, сейчас нет
    if (isLoading) {
        return (
            <ProfileCardRedesignSceleton />
        );
    }

    if (error) {
        return (
            <ProfileCardRedesignError />
        );
    }

    return (
        <ProfileCardRedesign {...props} />
    );
};
