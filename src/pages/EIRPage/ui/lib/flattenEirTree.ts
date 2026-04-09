import { EIRNavigationSection } from './types';

export const flattenEirTree = (sections: EIRNavigationSection[]): EIRNavigationSection[] => sections
    .reduce<EIRNavigationSection[]>((acc, section) => {
        acc.push(section);

        if (section.children.length) {
            acc.push(...flattenEirTree(section.children));
        }

        return acc;
    }, []);
