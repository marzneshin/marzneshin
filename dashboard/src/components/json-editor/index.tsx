import JSONEditor, { JSONEditorMode, JSONEditorOptions } from "jsoneditor";
import { useTheme } from "@marzneshin/features/theme-switch";
import "jsoneditor/dist/jsoneditor.css";
import { forwardRef, useEffect, useRef } from "react";
import "./theme.css";
import "./themes.js";

export type JSONEditorProps = {
    onChange: (value: string) => void;
    json: any;
    mode?: JSONEditorMode;
};
export const JsonEditor = forwardRef<HTMLDivElement, JSONEditorProps>(
    ({ json, onChange, mode = "code" }, ref) => {
        const { theme } = useTheme();
        const options: JSONEditorOptions = {
            mode,
            onChangeText: onChange,
            statusBar: false,
            mainMenuBar: false,
            theme: theme === "dark" ? "ace/theme/marzneshin_dark" : "ace/theme/dawn",
        };

        const jsonEditorContainer = useRef<HTMLDivElement>(null);
        const jsonEditorRef = useRef<JSONEditor | null>(null);

        useEffect(() => {
            jsonEditorRef.current = new JSONEditor(
                jsonEditorContainer.current!,
                options
            );

            return () => {
                if (jsonEditorRef.current) jsonEditorRef.current.destroy();
            };
        }, []);

        useEffect(() => {
            if (jsonEditorRef.current) jsonEditorRef.current.update(json);
        }, [json]);

        return (
            <div
                ref={ref}
                className="border-2 border-solid border-gray-300 dark:border-gray-500 rounded-md h-full"
            >
                <div className="h-full" ref={jsonEditorContainer}></div>
            </div>
        );
    }
);
