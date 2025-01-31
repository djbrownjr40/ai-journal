// src/types/trumbowyg.d.ts
declare module 'trumbowyg' {
    interface TrumbowygOptions {
        btns?: Array<Array<string | { fn: string; title?: string; }>>;
        // Add any other options that are relevant to your use case
    }

    interface JQuery {
        trumbowyg(options?: any): JQuery<TElement>;
    }
}

interface JQuery {
    // noinspection JSUnusedLocalSymbols
    trumbowyg(command: 'html', content?: string): string;
  
    // noinspection JSUnusedLocalSymbols
    trumbowyg(command: 'openModal', options: JQueryTrumbowyg.ModalOptions): JQuery;
  
    // noinspection JSUnusedLocalSymbols
    trumbowyg(command: 'openModalInsert', options: JQueryTrumbowyg.ModalInsertOptions): JQuery;
  
    // noinspection JSUnusedLocalSymbols
    trumbowyg(command: 'closeModal' | 'saveRange' | 'restoreRange' | 'empty' | 'enable' | 'disable' | 'toogle' | 'destroy'): void;
  
    // noinspection JSUnusedLocalSymbols
    trumbowyg(command: 'getRange'): Range;
  
    // noinspection JSUnusedLocalSymbols
    trumbowyg(command: 'getRangeText'): string;
  
    // noinspection JSUnusedLocalSymbols
    trumbowyg(options?: JQueryTrumbowyg.Options): JQuery;
  }
  
  interface JQueryStatic {
    trumbowyg: JQueryTrumbowyg.StaticOptions;
  }
  
  declare namespace JQueryTrumbowyg {
    interface Trumbowyg extends StaticOptions {
      // noinspection JSUnusedLocalSymbols
      openModal(title: string, content: string): JQuery;
  
      // noinspection JSUnusedLocalSymbols
      openModalInsert(title: string, fields: { [fieldName: string]: ModalFields },
                      callback: (values: string[]) => boolean): JQuery;
  
      closeModal(): void;
  
      saveRange(): void;
  
      restoreRange(): void;
  
      getRangeText(): string;
  
      getRange(): Range;
  
      // noinspection JSUnusedLocalSymbols
      html(html?: string): string;
  
      empty(): void;
  
      // noinspection JSUnusedLocalSymbols
      setDisabled(disabled: boolean): void;
  
      toggle();
    }
  
    interface StaticOptions {
      langs: any;
      plugins: any;
      svgPath: string | boolean;
      hideButtonTexts: boolean;
    }
  
    interface ModalOptions {
      title: string;
      content: string;
    }
  
    interface ModalInsertOptions {
      title: string;
      fields: {
        [fieldName: string]: ModalFields;
      }
      callback: (values: string[]) => boolean;
    }
  
    interface ModalFields {
      label?: string;
      name?: string;
      value?: string;
    }
  
    interface Options {
      lang?: string;
  
      fixedBtnPane?: boolean;
      fixedFullWidth?: boolean;
      autogrow?: boolean;
      autogrowOnEnter?: boolean;
      imageWidthModalEdit?: boolean;
  
      prefix?: string;
  
      semantic?: boolean;
      resetCss?: boolean;
      removeformatPasted?: boolean;
      tagsToRemove?: string[];
      btns?: string[][];
      btnsDef?: {
        [btnName: string]: ButtonDefinition;
      };
  
      inlineElementsSelector?: string;
  
      pasteHandler?: ((event: any) => void)[];
      imgDblClickHandler?: (event: any) => void;
  
      plugins?: {
        [pluginName: string]: PluginDefinition;
      };
    }
  
    interface PluginDefinition {
      init: (trumbowyg: Trumbowyg) => void;
      tagHandler?: (element: any, trumbowyg: Trumbowyg) => any[];
      destroy?: () => void;
    }
  
    interface ButtonDefinition {
      dropdown?: string[];
      fn?: string | (() => any);
      tag?: string;
      title?: string;
      text?: string;
      isSupported?: () => boolean;
      key?: string;
      param?: string;
      forceCSS?: boolean,
      class?: string,
      ico?: string;
      hasIcon?: boolean;
    }
  }