"use client";
import { Dispatch, RefObject, SetStateAction } from "react";
import { ArticleDraft } from "../_firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../_firebase/config";

function UseToolbar(
  textref: RefObject<HTMLTextAreaElement>,
  setArticleDraft: Dispatch<SetStateAction<ArticleDraft>>,
  articleDraft: ArticleDraft
) {
  const content = articleDraft.content;

  const undo = (length: number, newline = false, underline = false) => {
    const startPos = textref?.current?.selectionStart ?? 0;
    const endPos = textref?.current?.selectionEnd ?? 0;

    const newText = newline
      ? `${content.substring(0, startPos - length)}${content.substring(
          startPos,
          endPos
        )}${content.substring(endPos)}`
      : underline
      ? `${content.substring(0, startPos - 3)}${content.substring(
          startPos,
          endPos
        )}${content.substring(endPos + 4)}`
      : `${content.substring(0, startPos - length)}${content.substring(
          startPos,
          endPos
        )}${content.substring(endPos + length)}`;

    setArticleDraft({ ...articleDraft, content: newText });

    setTimeout(() => {
      textref?.current?.focus();
      textref?.current?.setSelectionRange(startPos - length, endPos - length);
    }, 0);
  };

  const runInlineBtnAction = (char: string) => {
    const startPos = textref?.current?.selectionStart ?? 0;
    const endPos = textref?.current?.selectionEnd ?? 0;
    const length = char.length;

    if (
      content.substring(startPos - length, startPos) === char &&
      content.substring(endPos, endPos + length) === char
    ) {
      undo(length);
    } else {
      const newText = `${content.substring(
        0,
        startPos
      )}${char}${content.substring(startPos, endPos)}${char}${content.substring(
        endPos
      )}`;
      setArticleDraft({ ...articleDraft, content: newText });

      setTimeout(() => {
        textref?.current?.focus();
        textref?.current?.setSelectionRange(startPos + length, endPos + length);
      }, 0);
    }
  };

  const runNewLineBtnAction = (char: string) => {
    const startPos = textref?.current?.selectionStart ?? 0;
    const endPos = textref?.current?.selectionEnd ?? 0;
    const length = char.length;

    if (content.substring(startPos - length, startPos) === char) {
      undo(length, true);
    } else {
      const newText =
        startPos === 0 || content[startPos - 1] === "\n"
          ? `${content.substring(0, startPos)}${char}${content.substring(
              startPos,
              endPos
            )}${content.substring(endPos)}`
          : `${content.substring(0, startPos)}\n${char}${content.substring(
              startPos,
              endPos
            )}${content.substring(endPos)}`;

      setArticleDraft({ ...articleDraft, content: newText });

      setTimeout(() => {
        textref?.current?.focus();
        textref?.current?.setSelectionRange(
          startPos + length + (startPos === 0 ? 0 : 1),
          endPos + length + (startPos === 0 ? 0 : 1)
        );
      }, 0);
    }
  };

  const handleBold = () => runInlineBtnAction("**");
  const handleItalic = () => runInlineBtnAction("_");
  const handleStrikethrough = () => runInlineBtnAction("~~");
  const handleOrderedList = () => runNewLineBtnAction("1. ");
  const handleUnOrderedList = () => runNewLineBtnAction("- ");
  const handleQuote = () => runNewLineBtnAction("> ");

  const handleUnderline = () => {
    const startPos = textref.current?.selectionStart ?? 0;
    const endPos = textref.current?.selectionEnd ?? 0;

    if (
      content.substring(startPos - 3, startPos) === "<u>" &&
      content.substring(endPos, endPos + 4) === "</u>"
    ) {
      undo(3, false, true);
    } else {
      const newText = `${content.substring(0, startPos)}<u>${content.substring(
        startPos,
        endPos
      )}</u>${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      setTimeout(() => {
        textref.current?.focus();
        textref.current?.setSelectionRange(startPos + 3, endPos + 3);
      }, 0);
    }
  };

  const handleHeadings = (char: string) => runNewLineBtnAction(`${char} `);

  const handleLinking = () => {
    const startPos = textref.current?.selectionStart ?? 0;
    const endPos = textref.current?.selectionEnd ?? 0;
    const selectedText = content.substring(startPos, endPos);
    const length = selectedText.length;

    if (selectedText === "url") {
      const prevTextArr = content.substring(0, startPos - 2).split("[");
      const originalText = prevTextArr[prevTextArr.length - 1];

      const newText = `${content.substring(
        0,
        startPos - (originalText.length + 3)
      )}${originalText}${content.substring(endPos + 1)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      setTimeout(() => {
        textref.current?.focus();
        textref.current?.setSelectionRange(
          startPos - (originalText.length + 3),
          endPos - 6
        );
      }, 0);
    } else {
      const newText = `${content.substring(
        0,
        startPos
      )}[${selectedText}](url)${content.substring(endPos)}`;
      setArticleDraft({ ...articleDraft, content: newText });

      setTimeout(() => {
        textref.current?.focus();
        textref.current?.setSelectionRange(startPos + length + 3, endPos + 6);
      }, 0);
    }
  };

  const handleAddImage = (
    loading: boolean,
    url: string,
    startPos: number,
    endPos: number
  ) => {
    const newText = loading
      ? `${content.substring(
          0,
          startPos
        )}\n![Uploading](...)${content.substring(endPos)}`
      : `${content.substring(0, startPos)}${
          startPos === 0 || content[startPos - 1] === "\n" ? "" : "\n"
        }![Image alt description](${url})${content.substring(endPos)}`;

    setArticleDraft({ ...articleDraft, content: newText });
    textref.current?.focus();
  };

  const uploadImage = (
    e: any,
    textAreaRef: RefObject<HTMLTextAreaElement>,
    id: string
  ) => {
    let result = { result: null as string | null, error: null as any };
    const startPos = textAreaRef?.current?.selectionStart ?? 0;
    const endPos = textAreaRef?.current?.selectionEnd ?? 0;
    handleAddImage(true, "", startPos, endPos);

    const image = e.target.files[0];
    const uniqueImageName = `${id}-${image.name}`;
    const imageRef = ref(
      storage,
      `articles/${articleDraft.details.id}/${uniqueImageName}`
    );
    uploadBytes(imageRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          handleAddImage(false, url, startPos, endPos);
          result.result = "success";
        });
      })
      .catch((error) => {
        console.log(error);
        result.error = error;
      });
    return result;
  };

  return {
    handleBold,
    handleItalic,
    handleStrikethrough,
    handleOrderedList,
    handleUnderline,
    handleLinking,
    handleQuote,
    handleUnOrderedList,
    handleAddImage,
    handleHeadings,
    uploadImage,
  };
}

export default UseToolbar;
