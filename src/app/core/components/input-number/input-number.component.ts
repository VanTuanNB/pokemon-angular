import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    styleUrl: './input-number.component.scss',
})
export class InputNumberComponent {
    @Input() placeholder: string = '';
    @Input() min: number = 0;
    @Input() max: number = 1000;
    @Input() step: number = 1;
    @Input() disabled: boolean = false;

    public value: number | null = null;

    writeValue(value: number | null): void {
        this.value = value;
    }

    public propagateOnChange = (value: any) => {};
    public propagateTouched = () => {};

    registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }

    registerOnTouched(fn: any) {
        this.propagateTouched = fn;
    }

    public onChangeInput() {
        this.propagateOnChange(this.value);
        this.propagateTouched();
    }

    public onIncrease() {
        if (typeof this.value !== 'number') return;
        this.value = this.value >= this.max ? this.max : this.value + this.step;
    }

    public onDecrease() {
        if (typeof this.value !== 'number') return;
        this.value = this.value <= this.min ? this.min : this.value - this.step;
    }
}
