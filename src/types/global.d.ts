declare global {
    interface Window {
      $: typeof jQuery;
      jQuery: typeof jQuery;
    }
  }