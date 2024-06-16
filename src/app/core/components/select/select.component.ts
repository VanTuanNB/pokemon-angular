import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    SimpleChanges,
    ViewChild,
    forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DebounceDecorator } from '../../decorators/debounce.decorator';

export type ItemModel = {
    label: string;
    value: string;
};

type SelectOption = ItemModel & {
    checked: boolean;
};

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent {
    @ViewChild('selectElement', { static: true }) selectElement: ElementRef<HTMLDivElement> | null = null;
    @ViewChild('popperElement', { static: false }) popperElement: ElementRef<HTMLDivElement> | null = null;

    @Input() public mode: 'single' | 'multiple' = 'single';
    @Input() public placeholder: string = '';
    @Input() items: ItemModel[] = [];
    @Input() bindLabel: boolean = false;

    @Output() search = new EventEmitter<string>();

    public isOpenPopper: boolean = false;
    private mappingOption: Map<string, SelectOption> = new Map<string, SelectOption>();

    public options: SelectOption[] = [];
    public previewOptions: SelectOption[] = [];
    constructor(private cdr: ChangeDetectorRef) {}

    @HostListener('document:mousedown', ['$event'])
    onGlobalClick(event: Event): void {
        console.log(
            `this.selectElement!.nativeElement.contains(event.target as Node)`,
            this.selectElement!.nativeElement.contains(event.target as Node),
        );
        const isConstantPopper =
            !this.popperElement || !this.popperElement.nativeElement.contains(event.target as Node);
        if (!this.selectElement!.nativeElement.contains(event.target as Node) && isConstantPopper) {
            this.isOpenPopper = false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initMappingOptionHandler();
    }
    ngOnInit(): void {}

    writeValue(item: any) {
        if (this.mode === 'single' && item) {
            const itemSelected = this.mappingOption.get(item);
            if (itemSelected) this.mappingOption.set(itemSelected.value, { ...itemSelected, checked: true });
        }
        if (this.mode === 'multiple' && Array.isArray(item) && item.length) {
            item.forEach((item: any) => {
                const itemSelected = this.mappingOption.get(item);
                if (itemSelected) this.mappingOption.set(itemSelected.value, { ...itemSelected, checked: true });
            });
        }
        this.options = [...this.mappingOption.values()];
        this.previewOptionOnTop();
    }

    private initMappingOptionHandler() {
        this.items.forEach((item) => {
            this.mappingOption.set(item.value, { ...item, checked: false });
        });
        this.options = [...this.mappingOption.values()];
    }

    public onToggleInput(event: Event) {
        if (this.mode === 'multiple') {
            const inputTarget = event.target as HTMLInputElement;
            if (inputTarget.classList.contains('multiple')) {
                this.isOpenPopper = !this.isOpenPopper;
            }
        } else {
            this.isOpenPopper = !this.isOpenPopper;
        }
    }

    private previewOptionOnTop() {
        this.previewOptions = this.options.filter((item) => item.checked);
    }

    private filterOptionHandler(keyword: string) {
        const mapOptions = [...this.mappingOption.values()];
        this.options = mapOptions.filter((item) => item.label.toLowerCase().includes(keyword));
    }

    @DebounceDecorator(500)
    public onSearchKeyword(event: Event) {
        const keyword = (event.target as HTMLInputElement).value;
        this.filterOptionHandler(keyword);
        this.search.emit(keyword.trim());
    }

    public onSelectItem(itemSelected: SelectOption) {
        if (this.mode === 'single') {
            this.options = this.options.map((item) => {
                this.mappingOption.set(item.value, { ...item, checked: item.value === itemSelected.value });
                return { ...item, checked: item.value === itemSelected.value };
            });
            this.propagateOnChange(itemSelected.value);
            this.isOpenPopper = false;
        } else {
            for (const item of this.options) {
                if (item.value !== itemSelected.value) continue;
                item.checked = true;
                this.mappingOption.set(item.value, { ...item, checked: true });
            }
            this.propagateOnChange(this.options.filter((item) => item.checked).map((item) => item.value));
        }
        this.previewOptionOnTop();
        this.propagateTouched();
    }

    public onUnSelectItem(itemSelected: SelectOption, event?: Event) {
        if (event) event.stopPropagation();
        this.mappingOption.set(itemSelected.value, { ...itemSelected, checked: false });
        this.options = [...this.mappingOption.values()];
        console.log('hi', this.options);
        this.previewOptionOnTop();
        this.propagateOnChange(this.options.filter((item) => item.checked).map((item) => item.value));
        this.propagateTouched();
    }

    public trackBy(index: number, item: SelectOption) {
        return item.value;
    }

    public propagateOnChange = (value: any) => {};
    public propagateTouched = () => {};

    registerOnChange(fn: any) {
        this.propagateOnChange = fn;
    }

    registerOnTouched(fn: any) {
        this.propagateTouched = fn;
    }
}
