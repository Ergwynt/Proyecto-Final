import { mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm.vue'

test('emite onLogin al hacer submit', async () => {
  const wrapper = mount(LoginForm)
  await wrapper.find('input[type=text]').setValue('testuser')
  await wrapper.find('input[type=password]').setValue('password')
  await wrapper.find('button').trigger('click')

  expect(wrapper.emitted().onLogin).toBeTruthy()
})
