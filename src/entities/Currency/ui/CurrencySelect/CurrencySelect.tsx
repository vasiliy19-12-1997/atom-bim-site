import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ListBox } from '@/shared/ui/redesigned/Popups';
import { Currency } from '../../model/types/currency';

interface CurrencySelectProps {
    className?: string;
    onChange?: (value: Currency) => void;
    value?: Currency;
    readonly?: boolean;
}
const options = [
    { value: Currency.RUB, content: Currency.RUB },
    { value: Currency.USD, content: Currency.USD },
    { value: Currency.EUR, content: Currency.EUR },
];
export const CurrencySelect = memo(({ className, onChange, value, readonly }: CurrencySelectProps) => {
    const { t } = useTranslation();
    const onChangeCurrency = useCallback(
        (value: string) => {
            onChange?.(value as Currency);
        },
        [onChange],
    );

    const props = {
        className,
        onChange: onChangeCurrency,
        value,
        defaultValue: t('Укажите валюту'),
        readonly,
        items: options,
        direction: 'top right' as const,
        label: t('Укажите валюту'),
    };

    return (
        <ListBox {...props} />
    );
});
