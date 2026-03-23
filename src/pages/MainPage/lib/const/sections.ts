import {
    getRouteEir,
    getRouteInstruction,
    getRouteLibrary,
    getRouteTests,
    getRouteVideos,
} from '@/shared/const/router';
import sectionEirImage from '../assets/section_eir.png';
import libraryImage from '../assets/library.png';
import instructionImage from '../assets/instruction.png';
import stepModelingImage from '../assets/step_modeling.png';
import videosImage from '../assets/videos.png';
import testImage from '../assets/tests.png';

export const sectionsArrText = [
    {
        name: 'EIR',
        text: 'Корпоративный стандарт цифрового моделирования объектов капитального строительства.',
        img: sectionEirImage,
        path: getRouteEir(),
        linkText: 'Открыть EIR',
    },
    {
        name: 'Библиотека',
        text: 'Шаблоны проектов для разделов АР, КЖ, ВК, ОВ, ЭЛ, семейства и плагины для автоматизации проектирования.',
        img: libraryImage,
        path: getRouteLibrary(),
        linkText: 'Перейти в библиотеку',
    },
    {
        name: 'Этапы моделирования',
        text: 'Поэтапное описание процесса создания цифровой модели.',
        img: stepModelingImage,
        path: getRouteInstruction(),
        linkText: 'Смотреть этапы',
    },
    {
        name: 'Инструкции',
        text: 'Перечень инструкций и методических материалов по работе в Autodesk Revit и Civil 3D.',
        img: instructionImage,
        path: getRouteInstruction(),
        linkText: 'Открыть инструкции',
    },
    {
        name: 'Видеоматериалы',
        text: 'Видеоролики, инструкции и вебинары по разработке цифровой модели.',
        img: videosImage,
        path: getRouteVideos(),
        linkText: 'Смотреть видео',
    },
    {
        name: 'Тесты',
        text: 'Внутренняя система тестирования сотрудников и специалистов по цифровому моделированию.',
        img: testImage,
        path: getRouteTests(),
        linkText: 'Перейти к тестам',
    },
];
