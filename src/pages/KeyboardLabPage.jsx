/**
 * KeyboardLabPage — standalone route at /keyboardlab.
 */

import React, { lazy, Suspense, useEffect, useState } from "react";
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
import { useLabTranslation } from "../components/features/KeyboardLab/i18n/useLabTranslation";
import {
  SOUND_MODE,
  soundOptions,
  DEFAULT_SOUND_TYPE,
  DEFAULT_SOUND_TYPE_KEY,
} from "../components/features/sound/sound";

const KeyboardLabDemo = lazy(() =>
  import("../components/features/KeyboardLab/KeyboardLabDemo")
);

const KeyboardLabInner = ({ theme, setTheme, handleThemeChange }) => {
  const [soundMode, setSoundMode] = useLocalPersistState(SOUND_MODE, "sound-mode");
  const [soundType, setSoundType] = useLocalPersistState(DEFAULT_SOUND_TYPE, DEFAULT_SOUND_TYPE_KEY);
  const tLab = useLabTranslation();

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
        <Suspense
          fallback={
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: "calc(100vh - 200px)",
              color: theme.text, fontFamily: theme.fontFamily,
            }}>
              Loading Keyboard Lab…
            </div>
          }
        >
          <div style={{ height: "calc(100vh - 200px)", maxHeight: "calc(100vh - 200px)", overflow: "hidden" }}>
            <KeyboardLabDemo theme={theme} soundMode={soundMode} soundType={soundType} />
          </div>
        </Suspense>
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
            backLabel={tLab("lab_return")}
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
  );
};

const KeyboardLabPage = () => {
  const [theme, setTheme] = useState(() => {
    const raw = window.localStorage.getItem("theme");
    if (raw == null) return defaultTheme;
    try { return resolveTheme(JSON.parse(raw), loadCustomThemes()); }
    catch { return defaultTheme; }
  });

  const handleThemeChange = (e) => {
    window.localStorage.setItem("theme", JSON.stringify(e.value));
    setTheme(e.value);
  };

  useEffect(() => {
    applyEditorialBodyClass(theme);
  }, [theme]);

  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <KeyboardLabInner theme={theme} setTheme={setTheme} handleThemeChange={handleThemeChange} />
      </ThemeProvider>
    </LocaleProvider>
  );
};

export default KeyboardLabPage;
