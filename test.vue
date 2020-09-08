    setOrder() {
      //获取报单详情
      $http
        .post(
          `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_all_declaration_form`,
          { declarationFormNo: this.urls.declarationFormNo }
        )
        .then((res) => {
          let order = res.declarationForms[0];
          this.order = order;
          this.recommenderEncryptIdNo = this.encryIdNo(order.recommenderIdNo);
          this.recommenderEncryptIdNoCopy = this.recommenderEncryptIdNoCopy;
          this.investMemberNo = this.order.investmentAdviserMemberNo;
          let AccCate = order.recommenderBankAccountName;
          $http
            .post(
              `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_recommender_bank_info`,
              {}
            )
            .then((res) => {
              this.recommendBankName = res.bankInfoList;
              this.order.recommenderBankAccountName = AccCate;
            });
          this.order.investmentAdviserMemberNo = this.urls.investmentAdviserMemberNo;
          this.desensitizationIdNo = this.order.desensitizedIdNo;
          this.desensitizationIdNoCopy = this.desensitizationIdNo;
          // 历史推荐人手机号或推荐人姓名存在时，是否有推荐人显示为 ‘是’
          if (this.order.recommender || this.order.recommenderPhoneNo) {
            this.order.hasRecommender = 1;
          }

          // console.log(this.order);
          // 如果id不存在则设为null
          if (!(this.order.id > 0)) {
            this.$set(this.order, "id", null);
          }
          this.signedFilestemp = [].concat(order.paymentInstrumentPaths);
          this.contractFilestemp = [].concat(order.contractPaths);
          this.certificateFiles = [].concat(order.relatedDocumentsPaths);
          this.order.userIdentity = this.replaceNull(order.userIdentity, 0);
          this.order.hasRecommender = this.replaceNull(
            order.hasRecommender,
            ""
          );
          this.order.recommenderReferrerCompany = this.replaceNull(
            order.recommenderReferrerCompany,
            ""
          );
          this.order.recommenderReferrerUnit = this.replaceNull(
            order.recommenderReferrerUnit,
            ""
          );
          this.order.recommenderReferrerProperty = this.replaceNull(
            order.recommenderReferrerProperty,
            ""
          );
          this.order.propertyRecommenderEstate = this.replaceNull(
            order.propertyRecommenderEstate,
            ""
          );
          this.order.welfareCompany = this.replaceNull(
            order.welfareCompany,
            ""
          );
          this.order.recommenderReferrerLevel = this.replaceNull(
            order.recommenderReferrerLevel,
            ""
          );
          this.order.ownerProperty = this.replaceNull(order.ownerProperty, "");
          this.order.relatedDocumentsPaths = this.replaceNull(
            order.relatedDocumentsPaths,
            []
          );
          this.order.checkBillTypeIds = this.replaceNull(
            order.checkBillTypeIds,
            []
          );
          // let relatedDocumentsPath = JSON.parse(order.relatedDocumentsPath);
          // this.$set(this.order, 'relatedDocumentsPath', relatedDocumentsPath);
          if (this.order.returnProductDate == null) {
            this.order.returnProductDate = "";
          }
          let returnProductDate = this.order.returnProductDate.slice(0, 10);
          this.$set(this.order, "returnProductDate", returnProductDate);
          if (this.certificateFiles == null) {
            this.certificateFiles = [];
          }
          if (this.signedFilestemp == null) {
            console.log("this.signedFilestemp NULL"); //eslint-disable-line
            this.signedFilestemp = [];
          }
          if (this.contractFilestemp == null) {
            console.log("this.contractFilestemp NULL"); //eslint-disable-line
            this.contractFilestemp = [];
          }
          if (order.valueDate) {
            this.order.valueDate = order.valueDate.slice(0, 10);
          }
          if (this.order.recommenderEstate == null) {
            this.order.recommenderEstate = "";
          }
          this.recommenderEstateShow = order.recommenderEstate.length > 0;
          this.recommenderUnitNameShow = order.recommenderUnitName.length > 0;

          // 新增物业推荐人楼盘和推荐人所属单位
          this.showRecommenderPropertyBuilding =
            order.propertyRecommenderEstate.length > 0;
          this.showRecommenderUnit = order.recommenderReferrerUnit.length > 0;
          console.log(
            this.showRecommenderUnit +
              "-----------" +
              order.recommenderReferrerUnit.length
          );

          // 银行列表调用
          this.bankAboutList();
          this.getDataFromMtp();
          this.canToOrder();
          this.queryApplicable();
        })
        .catch((err) => {
          Toast(err);
        });
      // console.log(this.signedFilestemp);
    },
    // 银行所有字段列表
    bankAboutList() {
      console.log(this.order);
      // 初始化显示银行相关列表;
      $http
        .post(
          `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_bank_list`,
          {}
        )
        .then((res) => {
          this.bankNames = res.bankInfos;
          for (let i = 0; i < this.bankNames.length; i++) {
            if (this.bankNames[i].bankName == this.order.bankName) {
              this.bankCode = this.bankNames[i].bankCode;
              $http
                .post(
                  `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_bank_province_list`,
                  { bankCode: this.bankCode }
                )
                .then((res) => {
                  this.bankProvinces = res.bankProvinceInfos;
                  for (let j = 0; j < this.bankProvinces.length; j++) {
                    if (
                      this.bankProvinces[j].province == this.order.bankProvince
                    ) {
                      this.provinceCode = this.bankProvinces[j].provinceCode;
                      $http
                        .post(
                          `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_bank_city_list`,
                          {
                            bankCode: this.bankCode,
                            provinceCode: this.provinceCode,
                          }
                        )
                        .then((res) => {
                          this.bankCitys = res.bankCityInfos;
                          for (let k = 0; k < this.bankCitys.length; k++) {
                            if (this.bankCitys[k].city == this.order.bankCity) {
                              this.cityCode = this.bankCitys[k].cityCode;
                              $http
                                .post(
                                  `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_bank_branch_list`,
                                  {
                                    bankCode: this.bankCode,
                                    cityCode: this.cityCode,
                                  }
                                )
                                .then((res) => {
                                  this.bankAccts = res.bankBranchInfos;
                                  for (
                                    let k = 0;
                                    k < this.bankAccts.length;
                                    k++
                                  ) {
                                    if (
                                      this.bankAccts[k].bankBranchName ==
                                      this.order.bankAcctName
                                    ) {
                                      this.order.largeAmtBankNo = this.bankAccts[
                                        k
                                      ].largeAmtBankNo;
                                    }
                                  }
                                });
                            }
                          }
                        });
                    }
                  }
                });
            }
          }
        });
    },
    init() {
      const u = navigator.userAgent;
      const ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (ios) {
        const btm = ".oneItem::after";
        this.printCssStyle(btm);
      }
      const productId = JSON.parse(getUrlParam("productId"));
      if (productId) {
        this.order.productId = productId;
      }
      const inceptionDate = getUrlParam("inceptionDate");
      if (inceptionDate) {
        this.order.valueDate = inceptionDate.slice(0, 10);
      }
      const productName = getUrlParam("productName");
      if (productName) {
        this.order.productName = productName;
      }
      this.view = JSON.parse(getUrlParam("view"));
      this.imgShow = JSON.parse(getUrlParam("imgShow"));
      this.changeBtn = JSON.parse(getUrlParam("changeBtn"));
      this.urls = qs.parse(window.location.search.split("?")[1]);
      this.order.investmentAdviserName = this.urls.name;
      this.order.investmentAdviserPhoneNo = this.urls.phone;
      this.order.investmentAdviserMemberNo = this.urls.investmentAdviserMemberNo;
      if (this.view || this.changeBtn || this.imgShow) {
        if (this.view) {
          this.readonlyFlag = true;
        }
        this.setOrder();
      } else {
        this.getDataFromMtp();
        this.canToOrder();
      }
    },
    getDateTime(stime) {
      return new Date(stime.replace(/\-/g, "/"));
    },
    change() {
      this.view = false;
      this.isUpdate = true;
      this.readonlyFlag = false;
      let now = new Date();
      let prodTransEndTime = this.getDateTime(this.order.prodTransEndTime);
      let valueDate = this.getDateTime(this.order.valueDate);
      if (now > valueDate) {
        //已过起息日
        this.collecting = 0;
        this.readonlyFlag = true;
      } else {
        if (now < prodTransEndTime) {
          //未过预约（募集）结束时间
          this.collecting = 1;
        } else {
          // 已过预约（募集）结束时间
          this.collecting = 2;
        }
      }

      if (this.confirmFrozenFlag) {
        //已冻结
        this.collecting = 0;
        this.readonlyFlag = true;
      }
    },
    isNull(obj) {
      // 包括null和undefined
      return obj == null;
    },
    blurx(tag) {
      console.log(this.order.idNo);
      // console.log('xxx blurx tag:'+tag+' value:'+eval('this.order.'+tag)); //eslint-disable-line
    },
    // 身份证失去焦点事件
    blurId() {
      if (this.order.status == 2 || this.readonlyFlag) {
        return;
      }
      if (this.desensitizationIdNoCopy != this.desensitizationIdNo) {
        this.order.idNo = this.desensitizationIdNo;
        this.desensitizationIdNoCopy = this.desensitizationIdNo;
        console.log(true);
      }
      console.log(this.order.idNo);

      let billAttrArr = this.allbillAttrCollection();
      let str = this.order.idNo.replace(/^\s*|\s*$/g, "");
      this.$set(this.order, "idNo", str);
      if (billAttrArr.indexOf(3) > -1) {
        this.isOldCustom();
      }
      this.canToOrder();
    },
    // 单据类型和所有选择的叠加活动的集合
    allbillAttrCollection() {
      let billAttrArr = [];
      this.order.billTypeList.forEach((item) => {
        billAttrArr.push(item.billAttr);
      });
      return billAttrArr;
    },
    unitblur(tag) {
      // this.recommenderEstateShow = this.currentUnit.isPropCompany;
      // console.log('xxx unitblur tag:'+tag); //eslint-disable-line
      console.log(1);
    },
    containBlank(data) {
      return /\s+/.test(data); //eslint-disable-line
    },
    isValidString(str) {
      // 中间有空格，首尾无空格
      return !!str && (/^\S+.*\S+$/.test(str) || /^\S+$/.test(str));
    },
    // 清楚提示
    clearTips() {
      console.log(this);
      this.billTypeTip = "";
      this.phoneNoTip = "";
      this.userNameTip = "";
      this.certTypeTip = "";
      this.idNoTip = "";
      this.productIdTip = "";
      this.amountTip = "";
      this.bankCardNoTip = "";
      this.bankNameTip = "";
      this.bankProvinceTip = "";
      this.bankCityTip = "";
      this.bankAcctTip = "";
      this.largeAmtBankNoTip = "";
      this.investmentAdviserNameTip = "";
      this.recommenderTip = "";
      this.recommenderPhoneNoTip = "";
      /*=====================*/
      this.isHaveRecommenderTip = ""; // 是否有推荐人错误提示
      this.recommenderIdNoTip = ""; // 推荐人身份证号错误提示
      this.recommenderBankNoTip = ""; // 推荐人银行卡号错误提示
      this.recommenderBankNameTip = ""; // 推荐人开户行名称错误提示
      this.recommenderBankBranchTip = ""; // 推荐人开户行支行错误提示
      this.recommenderCompanyTip = ""; // 推荐人所属公司
      this.recommenderPropertyCompanyTip = ""; // 推荐人所属物业公司
      this.recommenderPropertyBuildingTip = ""; // 物业推荐人楼盘
      this.vipCompanyTip = ""; // 专享福利公司
      this.recommenderEmployeeLevelTip = ""; // 推荐人员工级别
      this.recommenderSAPTip = ""; // 推荐人员工级别
      this.backProductTip = ""; // 回款产品
      this.backAmountTip = ""; // 回款金额
      this.backExpireDateTip = ""; // 回款日期
      this.ownerBuildingTip = ""; // 业主楼盘
      this.ownerHouseTip = ""; // 业主房号
      /*=====================*/
      this.recommenderUnitNameTip = "";
      this.recommenderEstateTip = "";
      this.signedFilesTip = "";
    },
    // 去除左右空字符串
    trim(str) {
      if (this.isNull(str)) {
        str = "";
        return;
      }
      if (str != "") {
        str = str.replace(/^\s*|\s*$/g, "");
      }
    },
    // 校验单据类型大于3的受控字段
    validateControlWord() {
      // 校验推荐人单位
      if (
        this.recommenderUnitNameShow &&
        (this.isNull(this.order.recommenderUnitName) ||
          this.order.recommenderUnitName.length < 1)
      ) {
        this.recommenderUnitNameTip = "请正确填写推荐人单位";
        if (this.tips.length < 1) {
          this.tips = this.recommenderUnitNameTip;
        }
      }
      if (this.order.recommenderUnitName != "") {
        let res = this.subUnits.some((item, i) => {
          return this.order.recommenderUnitName == item.unitName;
        });
        if (!res) {
          this.recommenderUnitNameTip = "无此推荐人单位";
          if (this.tips.length < 1) {
            this.tips = this.recommenderUnitNameTip;
          }
        }
      }
      // 校验推荐人楼盘
      if (
        this.recommenderEstateShow &&
        (this.isNull(this.order.recommenderEstate) ||
          this.order.recommenderEstate.length < 1 ||
          this.containBlank(this.order.recommenderEstate))
      ) {
        this.recommenderEstateTip = "请正确填写推荐人楼盘";
        if (this.tips.length < 1) {
          this.tips = this.recommenderEstateTip;
        }
      }
      if (this.order.recommenderEstate != "") {
        let res = this.estates.some((item, i) => {
          return this.order.recommenderEstate == item.integratingProjectName;
        });
        if (!res) {
          this.recommenderEstateTip = "无此推荐人楼盘";
          if (this.tips.length < 1) {
            this.tips = this.recommenderEstateTip;
          }
        }
      }
      // 推荐人员工级别
      if (this.showRecommenderEmployeeLevel) {
        this.trim(this.order.recommenderReferrerLevel);
        if (this.order.recommenderReferrerLevel == "") {
          this.recommenderEmployeeLevelTip = "推荐人员工级别不能为空";
          if (this.tips.length < 1) {
            this.tips = this.recommenderEmployeeLevelTip;
          }
        }
      }
      // 推荐人员工SAP号
      if (this.showRecommenderSAP) {
        this.trim(this.order.recommenderReferrerSap);
        if (this.order.recommenderReferrerSap == "") {
          this.recommenderSAPTip = "推荐人员工SAP不能为空";
        }
        if (!/^\d{8,8}$/g.test(this.order.recommenderReferrerSap)) {
          this.recommenderSAPTip = "推荐人SAP号为8位数字，SAP号举例：00888888";
        }
        if (this.tips.length < 1) {
          this.tips = this.recommenderSAPTip;
        }
      }
      // 回款产品
      if (this.showBackProduct) {
        this.trim(this.order.returnProduct);
        if (this.order.returnProduct == "") {
          this.backProductTip = "回款产品不能为空";
        }
        if (this.tips.length < 1) {
          this.tips = this.backProductTip;
        }
      }
      // 回款金額
      if (this.showBackAmount) {
        // this.trim(this.order.returnProductAmount);
        let reg = /^([1-9]\d{0,8}|0)(\.\d{1,2})?$/g;
        if (!reg.test(this.order.returnProductAmount)) {
          this.backAmountTip = "回款金额最多9位整数,2位小数";
          if (this.tips.length < 1) {
            this.tips = this.backAmountTip;
          }
        }
        if (
          this.order.returnProductAmount == "" ||
          this.order.returnProductAmount == 0
        ) {
          this.backAmountTip = "回款金额不能为空";
          if (this.tips.length < 1) {
            this.tips = this.backAmountTip;
          }
        }
      }
      // 回款日期
      if (this.showBackExpireDate) {
        this.trim(this.order.returnProductDate);
        if (this.order.returnProductDate == "") {
          this.backExpireDateTip = "回款日期不能为空";
        }
        if (this.tips.length < 1) {
          this.tips = this.backExpireDateTip;
        }
      }
      // 推荐人所属公司
      if (this.showRecommenderCompany) {
        this.trim(this.order.recommenderReferrerCompany);
        if (this.order.recommenderReferrerCompany == "") {
          this.recommenderCompanyTip = "推荐人所属公司不能为空";
        }
        if (this.order.recommenderReferrerCompany != "") {
          // 判断所选的公司是否来自下拉框选项
          let res = this.companies.some((item, i) => {
            return this.order.recommenderReferrerCompany == item.companyName;
          });
          if (!res) {
            this.recommenderCompanyTip = "无此推荐人所属公司";
          }
        }
        if (this.tips.length < 1) {
          this.tips = this.recommenderCompanyTip;
        }
      }
      // 推荐人下属单位
      if (this.showRecommenderUnit) {
        this.trim(this.order.recommenderReferrerUnit);
        if (this.order.recommenderReferrerUnit == "") {
          this.recommenderUnitTip = "推荐人下属单位不能为空";
        }
        if (this.order.recommenderReferrerUnit != "") {
          // 判断所选的下属单位是否来自下拉框选项
          let res = this.newUnits.some((item, i) => {
            return this.order.recommenderReferrerUnit == item.unitName;
          });
          if (!res) {
            this.recommenderUnitTip = "无此推荐人下属单位";
          }
        }
        if (this.tips.length < 1) {
          this.tips = this.recommenderUnitTip;
        }
      }
      // 推荐人所属物业公司
      if (this.showRecommenderPropertyCompany) {
        this.trim(this.order.recommenderReferrerProperty);
        if (this.order.recommenderReferrerProperty == "") {
          this.recommenderPropertyCompanyTip = "推荐人所属物业公司不能为空";
        }
        if (this.order.recommenderReferrerProperty != "") {
          // 判断所选的物业公司是否来自下拉框选项
          let res = this.propertyCompanies.some((item, i) => {
            return this.order.recommenderReferrerProperty == item.companyName;
          });
          if (!res) {
            this.recommenderPropertyCompanyTip = "无此推荐人物业公司";
          }
        }
        if (this.tips.length < 1) {
          this.tips = this.recommenderPropertyCompanyTip;
        }
      }
      // 推荐人物业推荐人楼盘
      if (this.showRecommenderPropertyBuilding) {
        this.trim(this.order.propertyRecommenderEstate);
        if (this.order.propertyRecommenderEstate == "") {
          this.recommenderPropertyBuildingTip = "物业推荐人楼盘不能为空";
        }
        if (this.order.propertyRecommenderEstate != "") {
          // 判断楼盘是否来自下拉框选项
          let res = this.propertyBuildings.some((item, i) => {
            return (
              this.order.propertyRecommenderEstate ==
              item.integratingProjectName
            );
          });
          if (!res) {
            this.recommenderPropertyBuildingTip = "无此物业推荐人楼盘";
          }
        }
        if (this.tips.length < 1) {
          this.tips = this.recommenderPropertyBuildingTip;
        }
      }
      // 专享福利公司
      if (this.showVipCompany) {
        this.trim(this.order.welfareCompany);
        if (this.order.welfareCompany == "") {
          this.vipCompanyTip = "专享福利公司不能为空";
        }
        if (this.order.welfareCompany != "") {
          // 判断楼盘是否来自下拉框选项
          let res = this.vipCompanies.some((item, i) => {
            return this.order.welfareCompany == item.companyName;
          });
          if (!res) {
            this.vipCompanyTip = "无此专享福利公司";
          }
        }
        if (this.tips.length < 1) {
          this.tips = this.vipCompanyTip;
        }
      }
      // 业主楼盘
      if (this.showOwnerBuilding) {
        this.trim(this.order.ownerProperty);
        if (this.order.ownerProperty == "") {
          this.ownerBuildingTip = "业主楼盘不能为空";
        }
        if (this.order.ownerProperty != "") {
          // 判断所选的楼盘是否来自下拉框选项
          let res = this.ownerBuildings.some((item, i) => {
            return this.order.ownerProperty == item.integratingProjectName;
          });
          if (!res) {
            this.ownerBuildingTip = "无此业主楼盘";
          }
        }
        console.log(
          this.order.ownerProperty + "-" + this.order.ownerPropertyId
        );
        if (this.tips.length < 1) {
          this.tips = this.ownerHouseTip;
        }
      }
      // 业主房号
      if (this.showOwnerHouse) {
        this.trim(this.order.ownerRoomNumber);
        if (this.order.ownerRoomNumber == "") {
          this.ownerHouseTip = "业主房号不能为空";
        }
        if (this.tips.length < 1) {
          this.tips = this.ownerHouseTip;
        }
      }
      if (this.showCertificateFiles) {
        // 校验相关凭证
        if (
          this.isNull(this.certificateFiles) ||
          this.certificateFiles.length < 1
        ) {
          //eslint-disable-line
          this.certificateFilesTip = "相关凭证缺失";
          if (this.tips.length < 1) {
            this.tips = this.certificateFilesTip;
          }
        }
      }
    },
    // 校验推荐人信息
    validateRecommender() {
      // 判断推荐人姓名
      if (
        this.isNull(this.order.recommender) ||
        this.order.recommender.length < 1 ||
        !(
          /^\S+.*\S+$/.test(this.order.recommender) ||
          /^\S+$/.test(this.order.recommender)
        )
      ) {
        //eslint-disable-line
        this.recommenderTip = "请正确填写推荐人姓名";
        if (this.tips.length < 1) {
          this.tips = this.recommenderTip;
        }
      }
      // 判断推荐人手机号
      if (
        this.isNull(this.order.recommenderPhoneNo) ||
        !/^1[3-9]{1}[0-9]{9}$/.test(this.order.recommenderPhoneNo)
      ) {
        this.recommenderPhoneNoTip = "请正确填写手机号";
        if (this.tips.length < 1) {
          this.tips = this.recommenderPhoneNoTip;
        }
      }
      // 判断推荐人身份证号
      if (
        this.isNull(this.order.recommenderIdNo) ||
        this.order.recommenderIdNo.length < 1
      ) {
        //eslint-disable-line
        // || (this.order.certType == this.certTypes[0].certType && !/^\d{17}[\da-zA-Z]$/.test(this.order.recommenderIdNo))
        this.recommenderIdNoTip = "请正确填写证件号码";
        if (this.tips.length < 1) {
          this.tips = this.recommenderIdNoTip;
        }
      }
      // 判断推荐人银行卡号
      if (
        this.isNull(this.order.recommenderBankNo) ||
        this.order.recommenderBankNo.length < 1 ||
        !/^\d{16,19}$/.test(this.order.recommenderBankNo) ||
        this.containBlank(this.order.recommenderBankNo)
      ) {
        this.recommenderBankNoTip = "请正确填写银行卡号";
        if (this.tips.length < 1) {
          this.tips = this.recommenderBankNoTip;
        }
      }
      // 判断推荐人开户行名称
      if (
        this.isNull(this.order.recommenderBankAccountName) ||
        this.order.recommenderBankAccountName.length < 1 ||
        this.containBlank(this.order.recommenderBankAccountName)
      ) {
        this.recommenderBankNameTip = "请正确填写开户行名称";
        if (this.tips.length < 1) {
          this.tips = this.recommenderBankNameTip;
        }
      }
      // 判断推荐人开户行支行
      if (
        this.isNull(this.order.recommenderBankBranchName) ||
        this.order.recommenderBankBranchName.length < 1 ||
        this.containBlank(this.order.recommenderBankBranchName)
      ) {
        this.recommenderBankBranchTip = "请正确填写开户行支行";
        if (this.tips.length < 1) {
          this.tips = this.recommenderBankBranchTip;
        }
      }
    },
    submit() {
      this.clearTips();
      console.log(this.order.idNo);
      this.tips = "";
      console.log("dd" + JSON.stringify(this.order));
      if (
        this.isNull(this.currentBillActivityName) ||
        this.currentBillActivityName.length < 1 ||
        this.isNull(this.order.billTypeId) ||
        this.order.billTypeId < 1
      ) {
        this.billTypeTip = "请选择单据类型";
        if (this.tips.length < 1) {
          this.tips = this.billTypeTip;
        }
      }
      if (
        this.isNull(this.order.phoneNo) ||
        !/^1[3-9]{1}[0-9]{9}$/.test(this.order.phoneNo)
      ) {
        this.phoneNoTip = "请正确填写手机号";
        if (this.tips.length < 1) {
          this.tips = this.phoneNoTip;
        }
      }
      if (
        this.isNull(this.order.userName) ||
        this.order.userName.length < 1 ||
        !(
          /^\S+.*\S+$/.test(this.order.userName) ||
          /^\S+$/.test(this.order.userName)
        )
      ) {
        //eslint-disable-line
        this.userNameTip = "请正确填写客户姓名";
        if (this.tips.length < 1) {
          this.tips = this.userNameTip;
        }
      }
      if (this.isNull(this.order.certType) || this.order.certType.length < 0) {
        this.certTypeTip = "请正确填写证件类型";
        if (this.tips.length < 1) {
          this.tips = this.certTypeTip;
        }
      }
      // 添加老客户复投状态判断
      // 如果是身份证则校验这个
      if (this.order.certType == this.certTypes[0].certType) {
        if (
          this.isNull(this.order.idNo) ||
          this.order.idNo.length < 1 ||
          !/^\d{17}[\da-zA-Z]$/.test(this.order.idNo)
        ) {
          //eslint-disable-line
          this.idNoTip = "请正确填写身份证号";
          if (this.tips.length < 1) {
            this.tips = this.idNoTip;
          }
        }
      }
      // 如果是其他证件则校验这个
      if (this.order.certType == this.certTypes[1].certType) {
        if (!this.order.idNo) {
          this.idNoTip = "请正确填写证件号码";
          if (this.tips.length < 1) {
            this.tips = this.idNoTip;
          }
        }
      }
      if (
        this.isNull(this.order.productId) ||
        this.order.productId.length < 1 ||
        this.isNull(this.order.productName) ||
        this.order.productName.length < 1
      ) {
        this.productIdTip = "请正确填写产品";
        if (this.tips.length < 1) {
          this.tips = this.productIdTip;
        }
      }
      /*============================*/

      if (this.order.productName != "") {
        // 判断所选的产品是否来自下拉框选项
        let res = this.quotaProduct.some((item, i) => {
          return this.order.productName == item.productName;
        });
        if (!res) {
          this.productIdTip = "无此可售产品";
          if (this.tips.length < 1) {
            this.tips = this.productIdTip;
          }
        }
      }
      /*============================*/

      if (this.isNull(this.order.amount) || this.order.amount < 1) {
        this.amountTip = "请正确填写投资金额,金额必须大于0";
        if (this.tips.length < 1) {
          this.tips = this.amountTip;
        }
      }

      if (
        !this.isUpdate &&
        !this.isNull(this.quotaProduct) &&
        this.quotaProduct.length > 0
      ) {
        for (let index = 0; index < this.quotaProduct.length; index++) {
          //eslint-disable-line
          if (
            this.quotaProduct[index].productId == this.order.productId &&
            this.order.amount > this.quotaProduct[index].sellableAmount
          ) {
            //eslint-disable-line
            this.amountTip =
              "请正确填写投资金额,金额不能大于可售金额" +
              this.quotaProduct[index].sellableAmount; //eslint-disable-line
            if (this.tips.length < 1) {
              this.tips = this.amountTip;
            }
          }
        }
      }

      if (
        this.isNull(this.order.amount) ||
        parseFloat(this.order.amount) > 10000
      ) {
        this.amountTip = "请正确填写投资金额,金额必须小于10000";
        if (this.tips.length < 1) {
          this.tips = this.amountTip;
        }
      }
      if (
        this.isNull(this.order.bankCardNo) ||
        this.order.bankCardNo.length < 1 ||
        this.containBlank(
          this.order.bankCardNo || !/^\d{16,19}$/.test(this.order.bankCardNo)
        )
      ) {
        this.bankCardNoTip = "请正确填写银行卡号";
        if (this.tips.length < 1) {
          this.tips = this.bankCardNoTip;
        }
      }
      if (
        this.isNull(this.order.bankName) ||
        this.order.bankName.length < 1 ||
        this.containBlank(this.order.bankName)
      ) {
        this.bankNameTip = "请正确填写银行名称";
        if (this.tips.length < 1) {
          this.tips = this.bankNameTip;
        }
      }
      if (this.order.bankName != "") {
        // 判断银行名称是否来自下拉框选项
        let res = this.bankNames.some((item, i) => {
          return this.order.bankName == item.bankName;
        });
        if (!res) {
          this.bankNameTip = "无此银行名称";
        }
        if (this.tips.length < 1) {
          this.tips = this.bankNameTip;
        }
      }
      if (
        this.isNull(this.order.bankProvince) ||
        this.order.bankProvince.length < 1 ||
        this.order.bankCity.length > 30 ||
        this.containBlank(this.order.bankProvince)
      ) {
        this.bankProvinceTip = "请正确填写开户行省份";
        if (this.tips.length < 1) {
          this.tips = this.bankProvinceTip;
        }
      }
      if (this.order.bankProvince != "") {
        // 判断开户行省份是否来自下拉框选项
        let res = this.bankProvinces.some((item, i) => {
          return this.order.bankProvince == item.province;
        });
        if (!res) {
          this.bankProvinceTip = "无此开户行省份";
        }
        if (this.tips.length < 1) {
          this.tips = this.bankProvinceTip;
        }
      }
      if (
        this.isNull(this.order.bankCity) ||
        this.order.bankCity.length < 1 ||
        this.order.bankCity.length > 16 ||
        this.containBlank(this.order.bankCity)
      ) {
        this.bankCityTip = "请正确填写开户行城市";
        if (this.tips.length < 1) {
          this.tips = this.bankCityTip;
        }
      }
      if (this.order.bankCity != "") {
        // 判断开户行城市是否来自下拉框选项
        let res = this.bankCitys.some((item, i) => {
          return this.order.bankCity == item.city;
        });
        if (!res) {
          this.bankCityTip = "无此开户行城市";
        }
        if (this.tips.length < 1) {
          this.tips = this.bankCityTip;
        }
      }
      if (
        this.isNull(this.order.bankAcctName) ||
        this.order.bankAcctName.length < 1 ||
        this.order.bankAcctName.length > 30 ||
        this.containBlank(this.order.bankAcctName)
      ) {
        this.bankAcctTip = "请正确填写开户行支行";
        if (this.tips.length < 1) {
          this.tips = this.bankAcctTip;
        }
      }
      // v-on:onChange="bankNameOnChange"
      if (this.order.bankAcctName != "") {
        // 判断开户行支行是否来自下拉框选项
        let res = this.bankAccts.some((item, i) => {
          return this.order.bankAcctName == item.bankBranchName;
        });
        if (!res) {
          this.bankAcctTip = "无此开户行支行";
        }
        if (this.tips.length < 1) {
          this.tips = this.bankAcctTip;
        }
      }
      if (
        this.isNull(this.order.largeAmtBankNo) ||
        this.order.largeAmtBankNo.length < 1 ||
        this.containBlank(this.order.bankAcctName)
      ) {
        this.largeAmtBankNoTip = "请填写大额行号";
        if (this.tips.length < 1) {
          this.tips = this.largeAmtBankNoTip;
        }
      }

      if (
        this.isNull(this.order.investmentAdviserName) ||
        this.order.investmentAdviserName.length < 1 ||
        !(
          /^\S+.*\S+$/.test(this.order.investmentAdviserName) ||
          /^\S+$/.test(this.order.investmentAdviserName)
        )
      ) {
        //eslint-disable-line
        this.investmentAdviserNameTip = "请正确填写投顾";
        if (this.tips.length < 1) {
          this.tips = this.investmentAdviserNameTip;
        }
      }
      /*=======================*/
      if (this.order.userIdentity == "") {
        this.customIdentityTip = "请选择客户身份";
        if (this.tips.length < 1) {
          this.tips = this.customIdentityTip;
        }
      }
      if (this.order.hasRecommender === "") {
        this.isHaveRecommenderTip = "请选择是否有推荐人";
        if (this.tips.length < 1) {
          this.tips = this.isHaveRecommenderTip;
        }
      }
      if (this.order.hasRecommender == 1) {
        this.validateRecommender();
      }
      this.validateControlWord(); // 校验受控字段
      // abc
      if (
        this.isNull(this.signedFilestemp) ||
        this.signedFilestemp.length < 1
      ) {
        //eslint-disable-line
        this.signedFilesTip = "凭证缺失";
        if (this.tips.length < 1) {
          this.tips = this.signedFilesTip;
        }
      }
      if (this.order.idNo == this.order.bankCardNo) {
        //eslint-disable-line
        if (this.tips.length < 1) {
          this.tips = "证件号码和银行卡号不能填写相同信息！";
        }
      }

      if (this.tips.length > 0) {
        this.$toast(this.tips);
        return;
      }
      var that = this.tips;
      $http
        .post(
          `${window.config.apiHost}/mtp/web/v1/investadviser/op_query_invest_adviser_by_name`,
          { name: this.order.investmentAdviserName }
        )
        .then((res) => {
          if (res.success) {
            console.log(res);
            if (res.exist == true) {
              this.doRegister();
            } else {
              this.investmentAdviserNameTip = "请正确填写投顾";
              this.$toast(this.investmentAdviserNameTip);
            }
          } else {
            console.log("出错了");
          }
        })
        .catch((error) => {
          console.log("出错了");
        });
    },
    ipu_text() {
      this.isAtive = true;
    },
    // 清除常规字段数据
    clearNormal() {
      this.$set(this.order, "recommender", "");
      this.$set(this.order, "recommenderPhoneNo", "");
      this.$set(this.order, "recommenderIdNo", "");
      this.$set(this.order, "recommenderBankNo", "");
      this.$set(this.order, "recommenderBankAccountName", "");
      this.$set(this.order, "recommenderBankBranchName", "");
      this.recommenderEncryptIdNo = "";
      this.recommenderEncryptIdNoCopy = "";
    },
    // 清洗数据
    cleanData() {
      if (!(this.order.recommenderReferrerCompanyId > 0)) {
        this.order.recommenderReferrerCompanyId = 0;
      }
      if (!(this.order.recommenderReferrerPropertyId > 0)) {
        this.order.recommenderReferrerPropertyId = 0;
      }
      if (!(this.order.propertyRecommenderEstateId > 0)) {
        this.order.propertyRecommenderEstateId = 0;
      }
      if (!(this.order.welfareCompanyId > 0)) {
        this.order.welfareCompanyId = 0;
      }
      if (!(this.order.ownerPropertyId > 0)) {
        this.order.ownerPropertyId = 0;
      }
      if (!(this.order.returnProductAmount > 0)) {
        this.order.returnProductAmount = 0;
      }
      if (!(this.order.recommenderUnitId > 0)) {
        this.order.recommenderUnitId = 0;
      }
      if (!(this.order.recommenderReferrerUnitId > 0)) {
        this.order.recommenderReferrerUnitId = 0;
      }
    },
    certifyIdentity(realNameReq) {
      // { idNo, name}
      return $http.post(
        `${window.config.apiHost}/mtp/h5/v1/innerInvest/certifyIdentity`,
        realNameReq
      );
    },
    certifyRecommenderIdentity(realNameReq) {
      // {idNo, name}
      return $http.post(
        `${window.config.apiHost}/mtp/h5/v1/innerInvest/certifyIdentity-recommender`,
        realNameReq
      );
    },
    certifyRecIdNoThenPostMessage(realNameReqRecommender, url, order) {
      this.certifyRecommenderIdentity(realNameReqRecommender)
        .then((res) => {
          if (res.result == 1) {
            this.submitOrder(url, order);
          } else {
            this.hasLoading = false;
            // this.$toast(res.resultMsg);
          }
        })
        .catch((error) => {
          this.hasLoading = false;
          console.log(error);
        });
    },
    submitOrder(url, order) {
      $http
        .post(url, order)
        .then((res) => {
          if (res.success) {
            if (res.limitStatus == 1) {
              this.$toast(res.limitMessage);
            }
            this.hasLoading = false;
            this.resultOk = res.success;
            this.resultShow = true;
          } else {
            this.hasLoading = false;
          }
        })
        .catch((error) => {
          this.hasLoading = false;
          console.log("出错了");
        });
    },
    // 提交请求
    postMessage() {
      if (this.hasLoading == false) {
        this.hasLoading = true;
        // 提交请求
        let url = `${window.config.apiHost}/mtp/web/v1/innerInvest/op_create_declaration_form`;
        if (this.isUpdate) {
          url = `${window.config.apiHost}/mtp/web/v1/innerInvest/op_update_declaration_form`;
        }
        this.order.contractFiles = JSON.stringify(this.contractFilestemp);
        this.order.signedFiles = JSON.stringify(this.signedFilestemp);
        this.order.relatedDocumentsFiles = JSON.stringify(
          this.certificateFiles
        );
        this.order.paymentInstrumentPaths = this.order.contractPaths = this.order.relatedDocumentsPaths = null;
        let temp = this.getActivitiesBill();
        this.order.groupId = temp.groupId;
        this.order.checkBillTypeIds = temp.checkBillTypeIds;
        // 请求之前清洗数据
        this.cleanData();
        this.order.returnProductAmount = parseFloat(
          this.order.returnProductAmount
        );
        this.order.checkBillTypeName = this.currentBillActivityName;
        // console.log('xxx signedFilestemp:' + this.signedFilestemp); //eslint-disable-line
        console.log(this.order);
        let realNameReq = {
          idNo: this.order.idNo,
          name: this.order.userName,
        };
        let realNameReqRecommender = {
          idNo: this.order.recommenderIdNo,
          name: this.order.recommender,
        };
        let billTypeIds = [];
        for (let i = 0; i < this.order.billTypeList.length; i++) {
          // if(i==this.order.billTypeList.length-1){
          //   billTypeIds+=this.order.billTypeList[i].id;
          // }else{
          //   billTypeIds+=this.order.billTypeList[i].id+',';
          // }
          billTypeIds.push(this.order.billTypeList[i].id);
        }
        let reqEst = {
          recommenderReferrerCompanyId: this.order.recommenderReferrerCompanyId
            ? this.order.recommenderReferrerCompanyId
            : null,
          declarationFormId: this.order.id ? this.order.id : null,
          idNo: this.order.idNo,
          billTypeIds: JSON.stringify(billTypeIds).slice(
            1,
            JSON.stringify(billTypeIds).length - 1
          ),
          recommenderIdNo:
            this.order.hasRecommender == 1 && this.order.recommenderIdNo
              ? this.order.recommenderIdNo
              : null,
        };
        $http
          .post(
            `${window.config.apiHost}/mtp/h5/v1/innerInvest/op_query_mkt_activity_seniority`,
            reqEst
          )
          .then((res) => {
            console.log(res);
            if (res.haveSeniority) {
              this.idNoTip = "";
              if (this.order.certType == 0) {
                this.certifyIdentity(realNameReq)
                  .then((res) => {
                    if (res.result == 1) {
                      if (this.order.hasRecommender == 1) {
                        this.certifyRecIdNoThenPostMessage(
                          realNameReqRecommender,
                          url,
                          this.order
                        );
                      } else {
                        this.submitOrder(url, this.order);
                      }
                    } else {
                      this.hasLoading = false;
                      // this.$toast(res.resultMsg);
                    }
                  })
                  .catch((error) => {
                    this.hasLoading = false;
                    console.log(error);
                  });
              } else {
                if (this.order.hasRecommender == 1) {
                  this.certifyRecIdNoThenPostMessage(
                    realNameReqRecommender,
                    url,
                    this.order
                  );
                } else {
                  this.submitOrder(url, this.order);
                }
              }
            } else {
              this.hasLoading = false;
              this.idNoTip = res.message;
              this.$toast(res.message);
            }
          });
      }
    },
    doRegister() {
      let billAttrArr = this.allbillAttrCollection();
      if (billAttrArr.indexOf(3) > -1) {
        this.isOldCustom(this.postMessage);
      } else {
        this.postMessage();
      }
    },
    buttonOkClick() {
      if (this.resultOk) {
        var ioss = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (ioss) {
          try {
            webkit.messageHandlers.closeHDOrderWebActivity.postMessage(null);
          } catch (error) {
            console.error("The native context not exist ");
          }
        } else {
          window.tg.closeHDOrderWebActivity();
        }
      }
      this.resultShow = false;
    },
    buttonCancelClick() {
      // location.href = this.resultOk ? './createOrder.html' : './index.html';
      if (!this.resultOk) {
        //  location.href = "./index.html";
        var ioss = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (ioss) {
          try {
            webkit.messageHandlers.closeHDOrderWebActivity.postMessage(null);
          } catch (error) {
            console.error("The native context not exist ");
          }
        } else {
          window.tg.closeHDOrderWebActivity();
        }
      }
      this.resultShow = false;
    },
    queryApplicable() {
      console.log(this.order.idNo);
      if (this.order.idNo == "" && !this.order.idNo) {
        this.changeRequest = false;
        return;
      }
      //查询是否可申请变更。（申请变更按钮是否置灰）
      $http
        .post(
          `${window.config.apiHost}/mtp/h5/v1/changeApply/query_applicable`,
          {
            customIdNo: this.order.idNo,
            declarationFormNo: this.urls.declarationFormNo,
            bankCardNo: this.order.bankCardNo,
          }
        )
        .then((res) => {
          if (res.respCode == "1000") {
            this.changeRequest = true;
          }
        });
    },
  },
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
  background: #f5f4f3;
  input::-webkit-input-placeholder {
    font-family: PingFangSC-Light;
    color: #cccccc;
  }
  input::-moz-placeholder {
    font-family: PingFangSC-Light;
    color: #cccccc;
  }
  input::-ms-input-placeholder {
    font-family: PingFangSC-Light;
    color: #cccccc;
  }
}
.dz_textarea textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #9c9c9c;
}
.dz_textarea textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #9c9c9c;
}
.dz_textarea textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #9c9c9c;
}
.dz_textarea textarea::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #9c9c9c;
}
.text_top {
  background-color: #fff;
  width: 100%;
  height: 140px;
}
.top_bor {
  width: 90%;
  height: 120px;
  margin: 0 auto;
  position: relative;
  top: 8px;
  border: 1px solid gray;
}
.top_center {
  width: 98.8%;
  height: 80px;
  border: none;
  outline: none;
}
.top_right {
  float: right;
  position: relative;
  right: 8px;
  top: -5px;
}
.top_title {
  float: right;
  margin: -40px 16px;
  background: #e85912;
  border: none;
  height: 1.25rem;
  /* width: 3.5rem; */
  color: #fff;
  font-size: 12px;
}
.btn_left {
  background: #fff;
  border-color: #e8550c;
  height: 25px;
  width: 70px;
  color: #e85912;
}
.btn_right {
  background: #e85912;
  border: none;
  height: 25px;
  width: 70px;
  color: #fff;
}
.title {
  width: 93%;
  height: 60px;
  color: gray;
  background: #f5f4f3;
  text-align: left;
  line-height: 60px;
  font-size: 13px;
  padding: 0 13px;
}
.oneSelect {
  position: fixed;
  top: -0.5rem;
  right: 10px;
  margin: 1rem 0;
  border: none;
  outline: medium;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 0.75rem;
  background: #fff;
  color: #333333;
  -moz-text-align-last: right;
  text-align-last: right;
}
.oneItem {
  width: 93%;
  height: 40px;
  line-height: 40px;
  float: left;
  padding: 0 13px;
  font-size: 14px;
  background: #ffffff;
  font-family: PingFangSC-Medium;
  font-size: 15px;
  color: #333333;
}
.ctd {
  width: 100%;
  height: 40px;
  position: relative;
}
/* .oneItem::after {
  display: flex;
  width: 100%;
  height:2px;
  background:#ddd;
  content:'';
  position: relative;
  bottom: 23px;
  /* background: rgba(0, 0, 0, 0.0); 
} */
.oneItem_myBill {
  width: 93%;
  min-height: 40px;
  line-height: 40px;
  padding: 0 13px;
  font-size: 14px;
  background: #ffffff;
  font-family: PingFangSC-Medium;
  font-size: 15px;
  color: #333333;
}
/* .clearMyFix::after{
  content: '';
  display: block;
  height: 0;
  clear: both;
} */
.ctd_myBill {
  width: 100%;
  min-height: 40px;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.ctd_myBill span {
  width: 80px;
}
.myWrap {
  word-wrap: break-word;
  word-break: break-all;
}
.ctd_myBill > div {
  box-sizing: border-box;
  line-height: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  height: auto;
  position: relative;
  width: 180px;
  margin: 0;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 15px;
}
.ctd_myBill > div > div {
  line-height: 20px;
}
.ctd_myBill::after {
  display: block;
  width: 100%;
  height: 2px;
  background: #ddd;
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
}
.ctd::after {
  display: block;
  width: 100%;
  height: 2px;
  background: #ddd;
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
}
.oneItemx {
  position: relative;
}
.oneItemx::after {
  height: 2px;
  background: #ddd;
  border: 0;
  content: "";
  width: 93%;

  position: absolute;
  bottom: 0;
  left: 13px;
}

@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .ctd::after {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .oneItemx::after {
    transform: scaleY(0.5);
  }
}

/* 3倍屏 */
/* @media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
    .oneItem::after{
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
    }
    .oneItemx::after{
      transform:scaleY(0.33);
    }
} */
.bom-bor {
  height: 2rem;
}
.bom-bor:after {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ddd;
  transform: scaleY(0.5);
  content: "";
  position: relative;
  bottom: 22px;
}
.input_area {
  position: relative;
  float: right;
  width: 180px;
  margin: 0;
  border: none;
  outline: medium;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 15px;
  color: #cccccc !important;
  height: 2rem;
  box-sizing: border-box;
}
.input_areab {
  position: relative;
  float: right;
  width: 180px;
  margin: 0;
  border: none;
  outline: medium;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 15px;
  color: #cccccc !important;
  height: 2rem;
  box-sizing: border-box;
}
select .seloptin {
  color: red;
}
.input_areac {
  float: right;
  margin: 20px 0px;
  border: none;
  outline: medium;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 15px;
  color: #333333 !important;
}
.begindate {
  float: right;
  color: gray;
  height: 3.2rem;
}
.begin_sp {
  font-family: PingFangSC-Light;
  font-size: 15px;
  color: #333333;
}
.oneItem_img {
  width: 93%;
  padding: 0 0.65rem;
  font-size: 0.7rem;
  background: #ffffff;
  position: relative;
  top: 17px;
  display: flex;
  flex-wrap: wrap;
}
.oneItem_img2 {
  width: 93%;
  padding: 0 0.65rem;
  font-size: 0.7rem;
  background: #ffffff;
  position: relative;
  top: 17px;
  display: flex;
  flex-wrap: wrap;
  float: left;
  margin-bottom: 16px;
}
.input_areaa {
  width: 45%;
  height: 5.25rem;
  margin: -0.1rem 0.45rem;
}
.img_select_left {
  position: relative;
  width: 50%;
  float: left;
  margin-top: 5px;
}
.img_select_left img {
  width: 95%;
  height: 105px;
  float: left;
  border-radius: 5px;
}

.img_select_right {
  position: relative;
  width: 50%;
  float: left;
  margin-top: 5px;
}
.img_select_right img {
  width: 95%;
  height: 105px;
  float: right;
  border-radius: 5px;
}
.text_center {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2rem;
  margin: auto;
  width: 60px !important;
  height: 60px !important;
}
.loading-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading {
  padding: 20px;
  background: #fff;
  text-align: center;
  font-size: 22px;
  color: #000;
}
.del-icon {
  position: absolute;
  top: 0;
  left: 0.5rem;
  color: #fff;
  font-size: 25px;
}
.oneItem_bz {
  width: 93%;
  height: 40px;
  line-height: 40px;
  float: left;
  padding: 0 13px;
  font-size: 14px;
  background: #ffffff;
  font-family: PingFangSC-Medium;
  color: #333333;
  margin: 16px 0 35px 0;
}
.submit {
  width: 17.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0.5rem 2rem;
  float: left;
}
.submits {
  flex: 1;
  height: 2.2rem;
  font-size: 20px;
  -webkit-border-radius: 0.25rem;
  border-radius: 0.25rem;
  border: none;
  position: relative;
  /* left: 2rem; */
  background: #e85912;
  color: #fff;
  margin: 0 0.5rem;
}
.disable {
  background: #cccccc;
  color: #999999;
}
.twoBtn {
  width: 40%;
}
.right_to_parent {
  font-size: 12px;
  text-align: right;
  color: red;
  margin: 0 20px;
  float: right;
}
.image_preview {
  width: 100% !important;
  height: 50% !important;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 999;
}
.pz_img {
  width: 100%;
  margin: 8px 0px;
}
select option {
  color: #333333 !important;
  font-family: PingFangSC-Light;
}
.debug {
  /* background: rgba(255, 0, 0, 0.5); */
}
.debug2 {
  /* background: rgba(0, 255, 0, 0.5); */
}
.margin_top {
  margin-top: 16px;
  margin-bottom: 35px;
}
.public {
  color: #333333 !important;
}
.sub_pz {
  height: 0;
}
.sub-xx {
  font-size: 0.5rem;
  color: gray;
}
.bottom_bom {
  width: 100%;
  height: 1rem;
}
.pop_name {
  width: 96%;
  font-size: 12px;
  border: 1px solid gray;
  padding: 0px 1% 2px 1%;
  margin: 0 2% 0 1%;
  /* background: #fff; */
  border: none;
  float: left;
}
.name_phne {
  /* background: #fff; */
  /* padding: 5px 2%; */
}
.nme {
  color: #333333;
  /* margin: 0 0 0 5px; */
}
.phne {
  /* margin: 0 5%; */
  float: right;
  color: #ff0000;
}
.idx {
  margin: 4px 0 0 0;
  width: 96%;
  /* padding: 5px 2%; */
  /* background: #fff; */
  color: #666666;
  /* float: left; */
}
.cancel {
  width: 100%;
  height: 25px;
  font-size: 12px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  border: none;
  margin: 4px 0 2px 0;
  padding: 0;
  /* float: left; */
  background-color: #fff;
  box-shadow: 0px 0px 3px 0.5px #ddd inset;
  -moz-box-shadow: 0px 0px 3px 0.5px #ddd inset;
  color: #333333;
}
.notbutton {
  background-color: #fff;
  box-shadow: 0px 0px 3px 0.5px #ddd inset;
  -moz-box-shadow: 0px 0px 3px 0.5px #ddd inset;
  padding: 5px 2%;
  /* background: rgba(0, 255, 0, 0.5); */
}
.search {
  background: rgba(0, 255, 0, 0.5);
  width: 98%;
  margin: 0 2% 0 0;
}
/* ====================== */
.customeIdentityOption_style {
  position: relative;
  top: -0.5rem;
  float: right;
  margin: 20px 0px;
  border: none;
  outline: medium;
  text-align: right;
  font-family: PingFangSC-Light;
  font-size: 15px;
  background: #fff;
  color: #333333;
  text-align-last: right;
}
/* ========================== */
.createOrder {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.billTypeHisChoice {
  border-bottom: 0.05rem solid #d9d9d9;
}
.billTypeChoiceInner {
  overflow: auto;
  max-height: 9.8rem;
  /* box-sizing:border-box; */
  padding: 0 0 0.25rem 0.75rem;
}
.billChoiceOne {
  padding: 0.55rem 1.5rem 0.55rem 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background: #c3a576;
  border-radius: 0.25rem;
  line-height: 0.9rem;
  position: relative;
}
.billChoiceOne > span {
  width: 100%;
  display: inline-block;
  font-size: 0.65rem;
  color: #fff;
  line-height: 0.9rem;
  text-align: center;
}
.billChoiceOne > i {
  position: absolute;
  top: 50%;
  transform: translateY(-45%);
  right: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: url(images/choiceClose.png) no-repeat center center;
  background-size: 0.5rem;
}
.billTypeChoiceList {
  display: flex;
  flex-wrap: wrap;
}
.billTypeChoiceName {
  line-height: 1.55rem;
  font-size: 0.65rem;
}
.billTypeModal {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #ffffff;
  z-index: 10;
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.billTypeChoiceInner {
  max-height: 9.6rem;
  overflow: auto;
}
.modalFooter {
  /* position: absolute;
  left: 0;
  bottom: 0; */
  width: 100%;
  height: 2.25rem;
  /* z-index: 1; */
  display: flex;
  background-color: #fff;
}
.modalContent {
  width: 100%;
  /* height: 100%; */
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  /* padding-bottom:2.25rem; */
  /* display: flex; */
}
.modalContent:after {
  content: "";
  display: block;
  clear: both;
}

.modalContentLeft {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 9rem;
  float: left;
  -webkit-overflow-scrolling: touch;
  /* background:#ddd; */
}
.modalContentLeft ul {
  margin: 0;
  padding: 0;
  width: 8.5rem;
  box-sizing: border-box;
}
.modalContentLeft li {
  width: 100%;
  box-sizing: border-box;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 2.5rem;
  background: #f8f8f8;
  border-bottom: 2px solid #ccc;
  font-size: 14px;
  color: #333;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modalContentLeft .activeBill {
  color: #fff;
  background-color: #c3a576;
}
.modalContentLeft .activeBill::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  border: 0.5rem solid;
  border-color: transparent transparent transparent #c3a576;
  transform: translate(90%, -50%);
  z-index: 1;
}
.modalContentRight {
  width: calc(100% - 9rem);
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  float: right;
  -webkit-overflow-scrolling: touch;
}
/* .modalContentRight > div{
  height: 101%;
} */
.modalContentRight .activityContainer {
  width: 100%;
  box-sizing: border-box;
  padding-right: 1rem;
  padding-left: 0.5rem;
}
.modalContentRight .activityContainer h3 {
  font-size: 15px;
  font-weight: 500;
}
.modalContentRight .activityContainer p {
  font-size: 13px;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 0.1rem;
  border-radius: 5px;
}
.modalContentRight .activityContainer p span {
  text-align: center;
}
.modalContentRight .activityContainer .activeActivity {
  background-color: #c3a576;
  color: #fff;
}
.modalFooter > span {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #c3a576;
  text-align: center;
  line-height: 2.25rem;
  font-size: 16px;
}
.modalFooter > span:first-of-type {
  color: #c3a576;
}
.modalFooter > span:last-of-type {
  color: #fff;
  background: #c3a576;
}
button,
input,
textarea {
  color: inherit;
  font: normal !important;
}
/* ========================== */
</style>

