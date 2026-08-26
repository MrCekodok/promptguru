"use server";

import { draftFromFormData } from "@/lib/form-draft";
import { buildPrompt } from "@/lib/prompt-builder";

export type JanaState = {
  prompt: string;
};

export async function janaPrompt(
  _previous: JanaState | null,
  formData: FormData
): Promise<JanaState> {
  const draft = draftFromFormData(formData);
  return { prompt: buildPrompt(draft) };
}
