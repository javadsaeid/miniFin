import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { I18nProvider, useTranslation } from "@/i18n/context";

function wrapper({ children }: { children: ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}

describe("i18n context", () => {
  it("throws when useTranslation used outside provider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTranslation())).toThrow(
      "useTranslation must be used within I18nProvider"
    );
    spy.mockRestore();
  });

  it("default locale is en", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.locale).toBe("en");
    expect(result.current.dir).toBe("ltr");
  });

  it("t() returns English translation", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.t("nav.home")).toBe("Home");
  });

  it("t() returns key when translation missing", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.t("unknown.key.here")).toBe("unknown.key.here");
  });

  it("setLocale switches to fa and dir becomes rtl", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    act(() => {
      result.current.setLocale("fa");
    });
    expect(result.current.locale).toBe("fa");
    expect(result.current.dir).toBe("rtl");
  });

  it("t() interpolates params", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    const translated = result.current.t("common.page", { current: "1-10", total: 42 });
    expect(translated).toContain("1-10");
    expect(translated).toContain("42");
  });

  it("setLocale persists to localStorage", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    act(() => {
      result.current.setLocale("fa");
    });
    expect(localStorage.getItem("minifin-locale")).toBe("fa");
  });
});
