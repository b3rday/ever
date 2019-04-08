import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ProductsCategoryService } from 'app/@core/data/productsCategory.service';
import { ILocaleMember } from '@modules/server.common/interfaces/ILocale';
import { ProductLocalesService } from '@modules/client.common.angular2/locale/product-locales.service';
import { BasicInfoFormComponent } from 'app/@shared/product/categories/forms/basic-info';
import { NotifyService } from 'app/@core/services/notify/notify.service';
import ProductsCategory from '@modules/server.common/entities/ProductsCategory';
import { CategoriesTableComponent } from 'app/@shared/product/categories/categories-table';

@Component({
	selector: 'ea-merchants-setup-product-categories',
	templateUrl: './product-categories.component.html',
	styleUrls: ['./product-categories.component.scss']
})
export class SetupMerchantProductCategoriesComponent {
	@ViewChild('basicInfo')
	basicInfo: BasicInfoFormComponent;

	@ViewChild('categoriesTable')
	categoriesTable: CategoriesTableComponent;

	productCategories: ProductsCategory[] = [];
	showPerPage = 3;

	private _showMutationForm: boolean = false;

	constructor(
		private productsCategoryService: ProductsCategoryService,
		private readonly notifyService: NotifyService,
		private readonly productLocalesService: ProductLocalesService
	) {}

	async add() {
		try {
			const category = await this.productsCategoryService
				.create(this.basicInfo.createObject)
				.pipe(first())
				.toPromise();
			this.productCategories.unshift(category);

			const message = `Category ${this.localeTranslate(
				this.basicInfo.createObject.name
			)} is added!`;
			this.notifyService.success(message);

			this.showMutationForm = false;
		} catch (err) {
			const message = `Something went wrong!`;
			const body = err.message
				? '\n' + `Error message: ${err.message}`
				: '';
			this.notifyService.error(message, body);
		}
	}

	get isValidForm() {
		let res = false;
		if (this.basicInfo) {
			res = this.basicInfo.form.valid;
		}

		return res;
	}

	get showMutationForm() {
		return this._showMutationForm;
	}

	set showMutationForm(isShow: boolean) {
		this._showMutationForm = isShow;

		if (!isShow) {
			this.loadCategories();
		}
	}

	loadCategories() {
		if (this.productCategories.length > 0) {
			this.categoriesTable.loadDataSmartTable(this.productCategories);
		}
	}

	removeCategory(category) {
		this.productCategories = this.productCategories.filter(
			(c) => c.id !== category.id
		);

		this.loadCategories();
	}

	localeTranslate(member: ILocaleMember[]) {
		return this.productLocalesService.getTranslate(member);
	}
}