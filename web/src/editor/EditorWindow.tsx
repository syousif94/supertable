import { useEffect, useRef, useState } from 'react';
import Editor, { EditorProps, useMonaco } from '@monaco-editor/react';
import Draggable from 'react-draggable';
import './MonacoLoader';
import {
  AutoTypings,
  LocalStorageCache,
} from 'monaco-editor-auto-typings/custom-editor';

export default function EditorWindow() {
  const monacoLoaded = useRef(false);
  const monaco = useMonaco();

  const handleEditorDidMount: EditorProps['onMount'] = async (
    editor,
    monaco
  ) => {
    if (monacoLoaded.current) {
      return;
    }
    monacoLoaded.current = true;
    await AutoTypings.create(editor, {
      sourceCache: new LocalStorageCache(),
      shareCache: true,
      monaco,
    });
    console.log(
      monaco.languages.typescript.typescriptDefaults.getCompilerOptions()
    );
  };

  const [resizing, setResizing] = useState(false);
  const [width, setWidth] = useState(280);
  const [height, setHeight] = useState(150);
  const dragging = useRef(false);
  const dragStartPoint = useRef([0, 0]);
  const dragStartSize = useRef([width, height]);
  return (
    <Draggable handle=".handle">
      <div
        style={{
          position: 'absolute',
          height: height + 60,
          width: width,
          borderRadius: 10,
          boxShadow: '0px 1px 30px -8px rgba(0,0,0,0.75)',
        }}
      >
        <div
          style={{
            height: 40,
            background: '#fff',
            borderBottom: '0.5px solid #ccc',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          className="handle"
        ></div>
        <div
          style={{
            height: height,
            width: width,
            pointerEvents: resizing ? 'none' : 'auto',
          }}
          className="editor"
        >
          <Editor
            height={`${height}px`}
            defaultLanguage="typescript"
            defaultValue=""
            onMount={handleEditorDidMount}
          />
        </div>

        <div
          style={{
            height: 20,
            background: '#fff',
            borderTop: '0.5px solid #ccc',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onPointerDown={(e) => {
            if (dragging.current) {
              return;
            }

            const onPointerMove = (e: PointerEvent) => {
              if (!dragging.current) {
                return;
              }
              setWidth(
                (width) =>
                  dragStartSize.current[0] -
                  (dragStartPoint.current[0] - e.clientX)
              );
              setHeight(
                (width) =>
                  dragStartSize.current[1] -
                  (dragStartPoint.current[1] - e.clientY)
              );
            };
            const onPointerUp = (e: PointerEvent) => {
              dragging.current = false;
              setResizing(false);
              window.removeEventListener('pointerup', onPointerMove);
              window.removeEventListener('pointerup', onPointerUp);
              console.log('pointerup');
            };
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointermove', onPointerMove);
            dragStartPoint.current = [e.clientX, e.clientY];
            dragStartSize.current = [width, height];
            dragging.current = true;
            setResizing(true);
          }}
          onPointerMove={(e) => {}}
        ></div>
      </div>
    </Draggable>
  );
}
