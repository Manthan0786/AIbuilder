import Editor from '@monaco-editor/react';

export function CodeEditor({ files, selectedfile }) {
    return (
       <div className="h-full">
            <div className="p-2 rounded-lg mt-4">
                {selectedfile !== null ? <Editor value={selectedfile.content || ""} 
                height="70vh"
                theme="vs-dark"
                loading="Loading..."
                defaultLanguage='javascript'/> : <div>hi</div>}
            </div> 
        </div>
    )
}
