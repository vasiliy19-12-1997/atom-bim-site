import { EIRSectionBoundary, EIRNavigationSection } from './types';

export const buildEirTree = (sections: EIRSectionBoundary[]): EIRNavigationSection[] => {
    const roots: EIRNavigationSection[] = [];
    const stack: EIRNavigationSection[] = [];

    sections.forEach((section) => {
        const node: EIRNavigationSection = {
            ...section,
            children: [],
        };

        while (stack.length && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }

        const parent = stack[stack.length - 1];

        if (parent) {
            node.parentId = parent.id;
            parent.children.push(node);
        } else {
            roots.push(node);
        }

        stack.push(node);
    });

    return roots;
};
