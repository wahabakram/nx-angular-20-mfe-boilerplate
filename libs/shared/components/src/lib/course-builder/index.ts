// Main Components
export { CourseBuilder } from './course-builder/course-builder';
export { LessonBuilder } from './lesson-builder/lesson-builder/lesson-builder';

// Lesson Builder Blocks (renamed to avoid conflicts with content-editor)
export { CodeBlock as LessonCodeBlock } from './lesson-builder/blocks/code-block/code-block';
export { HeadingBlock as LessonHeadingBlock } from './lesson-builder/blocks/heading-block/heading-block';
export { ImageBlock as LessonImageBlock } from './lesson-builder/blocks/image-block/image-block';
export { TextBlock as LessonTextBlock } from './lesson-builder/blocks/text-block/text-block';
export { YoutubeBlock as LessonYoutubeBlock } from './lesson-builder/blocks/youtube-block/youtube-block';

// Block Settings
export { CodeBlockSettings as LessonCodeBlockSettings } from './lesson-builder/blocks/code-block-settings/code-block-settings';
export { HeadingBlockSettings as LessonHeadingBlockSettings } from './lesson-builder/blocks/heading-block-settings/heading-block-settings';
export { ImageBlockSettings as LessonImageBlockSettings } from './lesson-builder/blocks/image-block-settings/image-block-settings';
export { TextBlockSettings as LessonTextBlockSettings } from './lesson-builder/blocks/text-block-settings/text-block-settings';
export { YoutubeBlockSettings as LessonYoutubeBlockSettings } from './lesson-builder/blocks/youtube-block-settings/youtube-block-settings';

// Directives
export { LessonBlockHostDirective } from './lesson-builder/lesson-block-host.directive';
export { FocusWithinDirective } from './lesson-builder/focus-within.directive';

// Services
export { LessonBuilderCommunicatorService } from './lesson-builder/lesson-builder-communicator.service';

// Models and Types
export * from './models/lesson-block.model';
export * from './models/code-block.model';
export * from './lesson-builder/types';
