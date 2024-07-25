import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RichTextInput.scss";
import Quill from "quill";
import { useNavigate } from "react-router-dom";
import "../../styles/components/RichTextEditor.scss";

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextInput:  React.FC<RichTextInputProps> = ({ value, onChange }) => {
  const navigate = useNavigate();
  const [editorHtml, setEditorHtml] = useState(value);

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const quillEditor = quillRef.current?.getEditor();

    quillEditor?.root.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("mention")) {
        const username = target.innerText.slice(1); // Remove '@' prefix
        // Redirect to user profile or artist dashboard based on user status
        console.log(`User mention clicked: ${username}`);
        navigate(`/profile/${username}`);
      }

      if (target.classList.contains("hashtag")) {
        const hashtag = target.innerText.slice(1); // Remove '#' prefix
        // Redirect to search page with the hashtag
        console.log(`Hashtag clicked: ${hashtag}`);
        navigate(`/search?tag=${hashtag}`);
      }

      if (target.classList.contains("url")) {
        const url = target.innerText;
        // Open URL in a new tab
        console.log(`URL clicked: ${url}`);
        window.open(url, "_blank");
      }
    });
  }, [navigate]);

  const handleChange = (html: string) => {
    setEditorHtml(html);
    onChange(html);
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={editorHtml}
      onChange={handleChange}
      modules={RichTextInput.modules}
      formats={RichTextInput.formats}
      placeholder="Type here..."
    />
  );
};

RichTextInput.modules = {
  toolbar: [["link"]],
  clipboard: {
    matchVisual: false,
  },
};

RichTextInput.formats = ["link"];

export default RichTextInput;
