import directive from './directives'

const importDirective = Vue => {
  /**
   * 拖拽指令 v-draggable="options"
   * options = {
   *  trigger: /这里传入作为拖拽触发器的CSS选择器/,
   *  body:    /这里传入需要移动容器的CSS选择器/,
   *  recover: /拖动结束之后是否恢复到原来的位置/
   * }
   */
  Vue.directive('draggable', directive.draggable)
  /**
   * 权限判断 v-has-permission
   * options=String|String只要拥有任何一个权限，就能够显示
   */
  Vue.directive('hasPermission',directive.hasPermission)
}

export default importDirective
