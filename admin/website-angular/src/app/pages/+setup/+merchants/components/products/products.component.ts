import {
	Component,
	ViewChild,
	Output,
	EventEmitter,
	OnInit,
	OnDestroy
} from '@angular/core';
import { SetupMerchantProductsCatalogComponent } from './products-catalog/products-catalog.component';
import Product from '@modules/server.common/entities/Product';
import { SetupMerchantAddProductsComponent } from './add-products/add-products.component';
import WarehouseProduct from '@modules/server.common/entities/WarehouseProduct';
import { WarehouseProductsRouter } from '@modules/client.common.angular2/routers/warehouse-products-router.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'ea-merchants-setup-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.scss']
})
export class SetupMerchantProductsComponent implements OnInit, OnDestroy {
	@ViewChild('productsCatalog')
	productsCatalog: SetupMerchantProductsCatalogComponent;
	@ViewChild('addProducts')
	addProducts: SetupMerchantAddProductsComponent;

	@Output()
	previousStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output()
	nextStep: EventEmitter<boolean> = new EventEmitter<boolean>();

	componentViews = {
		main: 'main',
		productsTable: 'productsTable',
		createProduct: 'createProduct',
		addProducts: 'addProducts'
	};
	productsPerPage = 3;
	// TODO get real warehouse id
	storeId = '5ca48ff5d32c2d18ac96f562';

	productsForAdd = [];
	storeProducts: WarehouseProduct[];

	private _currentView = this.componentViews.main;
	private _prevView = this.componentViews.main;
	private _ngDestroy$ = new Subject<void>();

	constructor(private warehouseProductsRouter: WarehouseProductsRouter) {}

	get haveProductsForAdd() {
		let hasSelectedCarriers = false;

		if (this.productsCatalog) {
			hasSelectedCarriers = this.productsCatalog.productsTable
				.hasSelectedProducts;
		}

		return hasSelectedCarriers;
	}

	get currentView() {
		return this._currentView;
	}

	set currentView(view: string) {
		this._prevView = this.currentView;
		this._currentView = view;
	}

	select() {
		this.productsForAdd = this.productsCatalog.productsTable.selectedProducts;
		this.currentView = this.componentViews.addProducts;
	}

	back() {
		if (this.currentView === this.componentViews.addProducts) {
			this.currentView = this._prevView;
			return;
		}

		this.currentView = this.componentViews.main;
	}

	ngOnInit(): void {
		if (this.storeId) {
			this.warehouseProductsRouter
				.get(this.storeId)
				.pipe(takeUntil(this._ngDestroy$))
				.subscribe((products) => {
					this.storeProducts = products;
				});
		}
	}

	ngOnDestroy(): void {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}