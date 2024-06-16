import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor() {}

    public loadingHandler(idElement: string, isShow = false) {
        const parentElement = document.querySelector(idElement) as HTMLElement;
        if (!parentElement) return;
        if (isShow) {
            parentElement.style.position = 'relative';
            const loadingElementNode = document.createElement('div');
            loadingElementNode.id = 'loading';
            loadingElementNode.innerHTML = `
                <div class="overlay"></div>
                <div class="loading-icon">
                    <i class="icon fa-solid fa-spinner"></i>
                </div>
            `;
            parentElement.appendChild(loadingElementNode);
        } else {
            const loadingElementNode = parentElement.querySelector('#loading') as Node;
            parentElement.removeChild(loadingElementNode && loadingElementNode);
        }
    }
}
