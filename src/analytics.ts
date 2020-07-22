import * as $ from 'jquery';

function createAnalytics(): object {
  let counter: number = 0;
  let isDestroyed: boolean = false;

  const listener = () => counter++;

  document.addEventListener('click', listener);

  return {
    destroy(): void {
      $('document').off('click', listener);
      isDestroyed = true;
    },
    getClick(): string {
      if (isDestroyed) {
        return `Analytics is destroyed! Total clicks = ${counter}!`;
      }

      return counter + '';
    }
  }
}

window['analytics'] = createAnalytics();
