<template>
  <div id="app">
    <div
    :class="[
      'autocomplete-department',
      { 'input-active': departmentInputActive },
    ]"
    @click="[departmentInputActive = true]"
    @keydown.enter="ResetDepartmentSelected"
    v-click-outside="HiddenDropdownOption"
  >
    <div>
      <input
        id="autocomplete"
        @input="
          FilterDepartment();
          InputChangedValue();
        "
        @keydown.40="MoveDownOption"
        @keydown.38="MoveUpOption"
        @click="isShowDepartmentList = true"
        v-model="departmentSearch"
        autocomplete="off"
      />
      <label
        class="department-icon-ctn"
        for="autocomplete"
        @click="isShowDepartmentList = !isShowDepartmentList"
      >
        <i class="fas fa-chevron-down"></i>
      </label>
    </div>
    <div
      class="dropdown-option"
      v-if="isShowDepartmentList"
      @keydown.40="MoveDownOption"
      @keydown.38="MoveUpOption"
    >
      <div class="department-title">
        <span>Tên đơn vị</span>
      </div>
      <ul :class="['list-option', { 'list-option-height': isShowLoading }]">
        <li
          v-for="(department, index) in fakeDepartments"
          :key="index"
          @click="SelectedDepartment(index, department)"
        >
          <a
            href="#"
            :class="[
              'option-item',
              {
                'selected-option':
                  department.departmentId === departmentSeleted &&
                  indexOptionSelected === index,
              },
            ]"
            >{{ department.departmentName }}</a
          >
        </li>
      </ul>
      <div
        class="message-no-data"
        v-if="fakeDepartments.length == 0 && isShowLoading === false"
      >
        Không có dữ liệu hiển thị
      </div>
      <div class="loading" v-if="isShowLoading">
        <i class="fa fa-spinner fa-spin"></i>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { HTTP } from './axios/http-common'
import Vue from 'vue'
import vClickOutside from 'v-click-outside'
var debounce = require('lodash.debounce')

Vue.use(vClickOutside)
export default {
  created () {
    HTTP.get('departments')
      .then((result) => {
        this.departments = result.data
        this.fakeDepartments = [...this.departments]
        this.departmentSeleted = this.departments[0].departmentId
        this.departmentSearch = this.departments[0].departmentName
      })
      .catch((err) => {
        console.log(err)
      })
  },
  data () {
    const rand = Math.random()
    return {
      variableId: rand,
      departments: [],
      fakeDepartments: [],
      isShowDepartmentList: false,
      departmentInputActive: false,
      departmentSearch: '',
      isShowLoading: false,
      departmentSeleted: '',
      indexOptionSelected: 0
    }
  },
  methods: {
    HiddenDropdownOption () {
      this.departmentInputActive = false
      this.isShowDepartmentList = false
    },
    FilterDepartment: debounce(function () {
      if (this.departmentSearch === '') {
        this.fakeDepartments = [...this.departments]
        this.departmentSeleted = this.fakeDepartments[0].departmentId
        this.isShowLoading = false
      } else {
        this.fakeDepartments = this.departments.filter((item) => {
          return item.departmentName.toLowerCase().indexOf(this.departmentSearch.toLowerCase()) !== -1
        })
        if (this.fakeDepartments.length > 0) {
          this.departmentSeleted = this.fakeDepartments[0].departmentId
          this.isShowLoading = false
        }
        this.isShowLoading = false
      }
    }, 500),
    InputChangedValue () {
      this.isShowLoading = true
      this.isShowDepartmentList = true
    },
    MoveDownOption () {
      this.isShowDepartmentList = true
      const options = [...this.$el.querySelectorAll('.option-item')]
      options.forEach((option, index) => {
        if (
          option.classList.contains('selected-option') &&
          this.indexOptionSelected < this.fakeDepartments.length
        ) {
          this.indexOptionSelected = index + 1
          if (this.indexOptionSelected === this.fakeDepartments.length) {
            this.indexOptionSelected = 0
            this.departmentSeleted = this.fakeDepartments[0].departmentId
            this.departmentSearch = options[0].innerText
            return true
          }
          this.departmentSeleted =
            this.fakeDepartments[this.indexOptionSelected].departmentId
          this.departmentSearch = options[this.indexOptionSelected].innerText
          return true
        }
      })
    },
    MoveUpOption () {
      this.isShowDepartmentList = true
      const options = [...this.$el.querySelectorAll('.option-item')]
      options.forEach((option, index) => {
        if (
          option.classList.contains('selected-option') &&
          this.indexOptionSelected >= 0
        ) {
          this.indexOptionSelected = index - 1
          if (this.indexOptionSelected === -1) {
            this.indexOptionSelected = options.length - 1
            this.departmentSeleted =
              this.fakeDepartments[this.indexOptionSelected].departmentId
            this.departmentSearch = options[this.indexOptionSelected].innerText
            return true
          }
          this.departmentSeleted =
            this.fakeDepartments[this.indexOptionSelected].departmentId
          this.departmentSearch = options[this.indexOptionSelected].innerText
          return true
        }
      })
    },
    SelectedDepartment (index, department) {
      this.indexOptionSelected = index
      this.departmentSeleted = department.departmentId
      this.departmentSearch = department.departmentName
      this.isShowDepartmentList = false
    },
    HiddenDepartmentList () {
      console.log('ok')
    },
    ResetDepartmentSelected () {
      this.isShowDepartmentList = !this.isShowDepartmentList
      this.departmentSearch = this.fakeDepartments[this.indexOptionSelected].departmentName
    }
  },
  watch: {
    departmentSeleted (newValue, oldValue) {
      this.$emit('updateDepartment', newValue)
    }
  }
}
</script>

<style lang="scss">
input {
    width: 100%;
    height: 32px;
    padding: 0 10px;
    font-size: 13px;
    border-radius: 15px;
    text-decoration: none;
    outline: none;
    appearance: none;
    transition: all 200ms;
    text-transform: uppercase;
}

.icon-arrow-down {
    background-position: -560px -359px;
}

.department-icon-ctn {
    width: 32px;
    height: 32px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
        background-color: #e0e0e0;
        border-color: #e0e0e0;
    }
}

.autocomplete-department {
    position: relative;
    border: 1px solid #babec5;

    .dropdown-option {
        position: absolute;
        top: 110%;
        left: -1px;
        min-width: 408px;
        width: 408px;
        background-color: #fff;
        border: 1px solid #babec5;
        border-radius: 2px;
        overflow: hidden;

        .department-title {
            background: #f4f5f8;
            height: 32px;
            padding: 0 10px;
            line-height: 32px;
            font-size: .85rem;
            font-family: 'noto-sans-Bold', sans-serif;
            color: #111;
        }

        .list-option {
            max-height: 160px;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 2px 1px;

            &-height {
                height: 160px;
            }

            // scrollbar dropdown option
            &::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            &::-webkit-scrollbar-thumb {
                background: #b8bcc3;
            }
            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            &::-webkit-scrollbar-track-piece {
                background-color: #f1f1f1;
                width: 10px;
            }

            li {
                .option-item {
                    padding: 0 10px;
                    height: 32px;
                    display: block;
                    line-height: 32px;
                    text-transform: uppercase;
                    font-family: 'noto-sans-Bold', sans-serif;
                    color: #111;
                    text-decoration: none;
                    padding: 0 20px;

                    &:hover {
                        color: #35bf22;
                        background-color: #ebedf0;
                    }
                }
            }

            .selected-option {
                color: #35bf22 !important;
                background-color: #ebedf0;
            }
        }

        .loading {
            position: absolute;
            top: 58%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 406px;
            height: 160px;
            font-size: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            color: #2CA01C;
        }

        .message-no-data {
            height: 32px;
            width: 406px;
            line-height: 32px;
            text-align: center;
        }
    }
}

.input-active {
    border: 1px solid #2ca01c;
}
</style>
