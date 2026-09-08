import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import type { Express } from 'express';
import type { AttachmentEntityType } from '../models/attachment.model.js';

const uploadsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
const folderFor = (entityType: AttachmentEntityType): string => entityType === 'CHAT' ? 'chat' : `${entityType.toLowerCase()}s`;

export const writeAttachment = async (file: Express.Multer.File, entityType: AttachmentEntityType): Promise<{ fileName: string; fileExtension: string; filePath: string }> => {
  const originalExtension = path.extname(file.originalname).toLowerCase();
  const fileExtension = originalExtension.slice(1);
  const fileName = `${randomUUID()}${originalExtension}`;
  const directory = path.join(uploadsRoot, folderFor(entityType));
  await mkdir(directory, { recursive: true });
  const filePath = path.join(directory, fileName);
  await writeFile(filePath, file.buffer, { flag: 'wx' });
  return { fileName, fileExtension, filePath };
};

export const removeAttachmentFile = async (filePath: string): Promise<void> => {
  if (!isAttachmentPath(filePath)) return;
  await unlink(filePath).catch(() => undefined);
};

export const isAttachmentPath = (filePath: string): boolean => {
  const root = path.resolve(uploadsRoot);
  const resolved = path.resolve(filePath);
  return resolved === root || resolved.startsWith(`${root}${path.sep}`);
};

export { uploadsRoot };