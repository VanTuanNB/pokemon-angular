import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-property-item',
    templateUrl: './property-item.component.html',
    styleUrl: './property-item.component.scss',
})
export class PropertyItemComponent {
    @Input() title: string = '';
    @Input() value: string = '';
    @Input() bgColorTitle: string = '#6bcc41';
    @Input() bgColor: string = '#f5f7fd;';
}
