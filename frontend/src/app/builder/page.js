"use client";

import { useSearchParams } from "next/navigation";
import { StepsList } from "../components/StepsList";
import { FileExplorer } from "../components/FileExplorer";
import { CodeEditor } from "../components/CodeEditor";
import { parseXml } from "../parseXML";
import { useEffect, useState } from "react";
import { useWebContainer } from "../hooks/useWebContainer";
import { Preview } from "../components/preview";
import { TabView } from "../components/TabView";

function Builder() {
  const searchParams = useSearchParams();
  const search = searchParams.get("data");
  const [currentstep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const webcontainer = useWebContainer();
  const [llmMessages, setLlmMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [assistantText, setAssistantText] = useState("");

  useEffect(() => {
    init();
  }, [search]);

  async function readChatStream(response, onTextChunk) {
    if (!response.ok || !response.body) {
      throw new Error("Unable to read model response stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed?.text) {
            fullText += parsed.text;
            onTextChunk?.(parsed.text);
          }
        } catch (error) {
          console.error("Invalid streamed payload line:", trimmed, error);
        }
      }
    }

    const trailing = buffer.trim();
    if (trailing) {
      try {
        const parsed = JSON.parse(trailing);
        if (parsed?.text) {
          fullText += parsed.text;
          onTextChunk?.(parsed.text);
        }
      } catch (error) {
        console.error("Invalid trailing streamed payload:", trailing, error);
      }
    }

    return fullText;
  }

  async function init() {
    if (!search?.trim()) {
      setAssistantText("Enter a prompt first to generate a response.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/template", {
        method: "POST",
        body: JSON.stringify({ prompt: search }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        setAssistantText(
          errBody.error || `Template request failed (${response.status})`,
        );
        setLoading(false);
        return;
      }
      const data = await response.json();
      const prompts = Array.isArray(data?.prompts) ? data.prompts : [];
      const uiPromptSeed = data?.uiprompt?.[0];

      if (uiPromptSeed) {
        setSteps(
          parseXml(uiPromptSeed).map((x) => ({
            ...x,
            status: "pending",
          })),
        );
      } else {
        setSteps([]);
      }

      setLoading(true);
      const stepsResponse = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...prompts, search].map((content) => ({
            role: "user",
            content,
          })),
        }),
        headers: { "Content-Type": "application/json" },
      });
      setAssistantText("");
      let xmlBuffer = "";
      await readChatStream(stepsResponse, (chunk) => {
        setAssistantText((prev) => prev + chunk);
        xmlBuffer += chunk;
        let match;
        while (
          (match = xmlBuffer.match(
            /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/,
          ))
        ) {
          const artifactChunk = match[0];
          setSteps((s) => [
            ...s,
            ...parseXml(artifactChunk).map((x) => ({
              ...x,
              status: "pending",
            })),
          ]);
          xmlBuffer = xmlBuffer.slice(match.index + artifactChunk.length);
        }
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setAssistantText(
        `Failed to load model response. ${error?.message || ""}`.trim(),
      );
    }
  }

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === "CreateFile") {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path == currentFolder,
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder,
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }
              // folder exists
              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder,
              );
              if (currentFileStructure && currentFileStructure.children) {
                currentFileStructure = currentFileStructure.children;
              }
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s) => {
          return {
            ...s,
            status: "completed",
          };
        }),
      );
    }
  }, [steps, files]);

  //WebConatiner Mount
  useEffect(() => {
    function createmountstructure(files, isroot) {
      const mountfiles = {};
      const processfile = (file) => {
        if (file.type == "folder") {
          mountfiles[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processfile(child, false),
                  ]),
                )
              : {},
          };
        } else if (file.type == "file") {
          if (isroot) {
            mountfiles[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }
        return mountfiles[file.name];
      };
      //console.log(files);
      files.forEach((file) => {
        processfile(file, true);
      });

      return mountfiles;
    }
    const mountfiles = createmountstructure(files, true);
    webcontainer?.mount(mountfiles);
  }, [files]);

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Website Builder
          </h1>
          <p className="mt-1 text-sm text-slate-500">Prompt: {search}</p>
        </header>
        <div className="h-full grid grid-cols-1 gap-3 p-3 lg:grid-cols-4">
          <div className="h-auto space-y-3 overflow-auto lg:col-span-1">
            <StepsList
              steps={steps}
              setSteps={setSteps}
              currentstep={currentstep}
              onStepClick={setCurrentStep}
              loading={loading}
              llmmessages={llmMessages}
              setLlmMessages={setLlmMessages}
            />
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <textarea
                className="h-36 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="Describe edits you want..."
                onChange={(e) => {
                  setUserPrompt(e.target.value);
                }}
              ></textarea>
              <div>
                <button
                  onClick={async () => {
                    const newMessage = {
                      role: "user",
                      content: userPrompt,
                    };
                    if (!newMessage.content.trim()) return;

                    try {
                      setLoading(true);
                      setAssistantText("");
                      const stepsResponse = await fetch(
                        "http://127.0.0.1:5000/chat",
                        {
                          method: "POST",
                          body: JSON.stringify({
                            messages: [...llmMessages, newMessage],
                          }),
                          headers: { "Content-Type": "application/json" },
                        },
                      );
                      let fullResponse = "";
                      fullResponse = await readChatStream(
                        stepsResponse,
                        (chunk) => {
                          setAssistantText((prev) => prev + chunk);
                        },
                      );
                      setLoading(false);
                      setLlmMessages((x) => [
                        ...x,
                        newMessage,
                        {
                          role: "assistant",
                          content: fullResponse,
                        },
                      ]);

                      setSteps((s) => [
                        ...s,
                        ...parseXml(fullResponse).map((x) => ({
                          ...x,
                          status: "pending",
                        })),
                      ]);
                      setUserPrompt("");
                    } catch (error) {
                      console.error(error);
                      setLoading(false);
                      setAssistantText(
                        `Request failed. ${error?.message || ""}`.trim(),
                      );
                    }
                  }}
                  className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
          <div className="h-[calc(100vh-8rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Model Response
              </p>
              <div className="max-h-28 overflow-auto text-sm text-slate-700">
                {assistantText ||
                  (loading
                    ? "Generating response..."
                    : "No response yet. Submit a prompt to see model output.")}
              </div>
            </div>
            <div className="col-span-2 h-full">
              {activeTab === "code" ? (
                <CodeEditor files={files} selectedfile={selectedFile} />
              ) : (
                <Preview webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Builder;
