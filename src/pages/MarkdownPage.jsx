/**
 * MarkdownPage — standalone route at /markdown.
 */

import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../style/global";
import { EditorialStyles } from "../style/editorial";
import { applyEditorialBodyClass, isEditorialTheme } from "../services/editorialChrome";
import { defaultTheme } from "../style/theme";
import { loadCustomThemes, resolveTheme } from "../style/customThemes";
import { LocaleProvider } from "../context/LocaleContext";
import useLocalPersistState from "../hooks/useLocalPersistState";
import useCustomThemeEditor from "../hooks/useCustomThemeEditor";
import Logo from "../components/common/Logo";
import DynamicBackground from "../components/common/DynamicBackground";
import MiniFooter from "../components/common/MiniFooter";
import CustomThemeEditor from "../components/features/CustomTheme/CustomThemeEditor";
import {
  SOUND_MODE,
  soundOptions,
  DEFAULT_SOUND_TYPE,
  DEFAULT_SOUND_TYPE_KEY,
} from "../components/features/sound/sound";

const FreeTypingBox = lazy(() =>
  import("../components/features/FreeTypingBox")
);

const MarkdownPage = () => {
  const [theme, setTheme] = useState(() => {
    const raw = window.localStorage.getItem("theme");
    if (raw == null) return defaultTheme;
    try { return resolveTheme(JSON.parse(raw), loadCustomThemes()); }
    catch { return defaultTheme; }
  });
  const [soundMode, setSoundMode] = useLocalPersistState(SOUND_MODE, "sound-mode");
  const [soundType, setSoundType] = useLocalPersistState(DEFAULT_SOUND_TYPE, DEFAULT_SOUND_TYPE_KEY);
  const textAreaRef = useRef(null);

  const handleThemeChange = (e) => {
    window.localStorage.setItem("theme", JSON.stringify(e.value));
    setTheme(e.value);
  };

  useEffect(() => {
    applyEditorialBodyClass(theme);
  }, [theme]);

  const {
    customThemes,
    editorOpen,
    editorMode,
    openEditorForNew,
    openEditorForCurrent,
    openEditorForId,
    activateTheme,
    deleteCustomThemeById,
    handleEditorChange,
    handleEditorSave,
    handleEditorCancel,
    handleEditorDelete,
  } = useCustomThemeEditor({ theme, setTheme });

  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <>
          <DynamicBackground theme={theme} />
          <div className="canvas">
            <GlobalStyles />
            {isEditorialTheme(theme) && <EditorialStyles />}
            <Logo
              isFocusedMode={false}
              theme={theme}
              soundMode={false}
              toggleSoundMode={() => {}}
              isMusicMode={false}
              toggleMusicMode={() => {}}
              toggleFocusedMode={() => {}}
              isUltraZenMode={false}
              toggleUltraZenMode={() => {}}
              customThemes={customThemes}
              onActivateTheme={activateTheme}
              onCreateTheme={openEditorForNew}
              onEditTheme={openEditorForId}
              onDeleteTheme={deleteCustomThemeById}
            />
            <div style={{ height: "calc(100vh - 200px)", overflow: "hidden" }}>
              <Suspense fallback={null}>
                <FreeTypingBox
                  textAreaRef={textAreaRef}
                  soundMode={soundMode}
                  soundType={soundType}
                />
              </Suspense>
            </div>
            <div className="bottomBar">
              <MiniFooter
                theme={theme}
                customThemes={customThemes}
                handleThemeChange={handleThemeChange}
                onCreateTheme={openEditorForNew}
                onEditCurrentTheme={openEditorForCurrent}
                soundMode={soundMode}
                toggleSoundMode={() => setSoundMode(!soundMode)}
                soundOptions={soundOptions}
                soundType={soundType}
                handleSoundTypeChange={(e) => setSoundType(e.label)}
              />
            </div>
            <CustomThemeEditor
              open={editorOpen}
              workingTheme={editorOpen ? theme : null}
              onChange={handleEditorChange}
              onSave={handleEditorSave}
              onCancel={handleEditorCancel}
              onDelete={handleEditorDelete}
              isExistingCustom={editorMode === "edit"}
              existingNames={customThemes
                .filter((t) => editorMode !== "edit" || t.id !== theme?.id)
                .map((t) => t.label)}
            />
          </div>
        </>
      </ThemeProvider>
    </LocaleProvider>
  );
};

export default MarkdownPage;
