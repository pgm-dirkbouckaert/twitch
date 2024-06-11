/**
 * Constants
 */
import 'dotenv/config';
import * as path from 'path';

export const BASE_URL = `http://localhost:${process.env.PORT}`;
export const SOURCE_PATH = path.resolve('src');
export const PUBLIC_PATH = path.resolve('public');
export const VIEWS_PATH = path.join(SOURCE_PATH, 'views');

export const AVATAR_PATH = path.join(PUBLIC_PATH, 'images', 'avatars');
export const AVATAR_EXT = 'jpg';
export const DEFAULT_AVATAR_FILENAME = 'default_avatar.png';

export const ICON_PATH = path.join(PUBLIC_PATH, 'images', 'topics');
export const ICON_EXT = 'png';

export const YOUTUBE_SEARCHURL = `https://www.googleapis.com/youtube/v3/search?key=${process.env.API_KEY_YOUTUBE}&part=snippet&maxResults=25&q=`;

export const MSG_200 = { message: 'Success' };
export const MSG_201 = { message: 'Created' };
export const MSG_400 = { message: 'Bad Request' };
export const MSG_401 = { message: 'Unauthorized' };
export const MSG_404 = { message: 'Not Found' };
export const MSG_409 = { message: 'Conflict' };
export const MSG_500 = { message: 'Internal Server Error' };
