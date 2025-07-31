import kivy
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.gridlayout import GridLayout
from kivy.uix.popup import Popup
from kivy.uix.scrollview import ScrollView
from kivy.clock import Clock
import requests
import json
from datetime import datetime
import threading

kivy.require('2.0.0')

# API Configuration
API_BASE_URL = 'http://localhost:5000/api'  # Change to your server URL

class LoginScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.build_ui()
    
    def build_ui(self):
        main_layout = BoxLayout(orientation='vertical', padding=20, spacing=10)
        
        # Title
        title = Label(
            text='VitalSync Mobile',
            font_size='24sp',
            size_hint_y=None,
            height='50dp',
            color=(0.2, 0.6, 0.9, 1)
        )
        main_layout.add_widget(title)
        
        # Subtitle
        subtitle = Label(
            text='Patient Health Tracker',
            font_size='16sp',
            size_hint_y=None,
            height='30dp',
            color=(0.5, 0.5, 0.5, 1)
        )
        main_layout.add_widget(subtitle)
        
        # Login Form
        form_layout = GridLayout(cols=1, spacing=10, size_hint_y=None)
        form_layout.bind(minimum_height=form_layout.setter('height'))
        
        # Email
        form_layout.add_widget(Label(text='Email:', size_hint_y=None, height='30dp'))
        self.email_input = TextInput(
            multiline=False,
            size_hint_y=None,
            height='40dp',
            hint_text='Enter your email'
        )
        form_layout.add_widget(self.email_input)
        
        # Password
        form_layout.add_widget(Label(text='Password:', size_hint_y=None, height='30dp'))
        self.password_input = TextInput(
            password=True,
            multiline=False,
            size_hint_y=None,
            height='40dp',
            hint_text='Enter your password'
        )
        form_layout.add_widget(self.password_input)
        
        # Login Button
        login_btn = Button(
            text='Login',
            size_hint_y=None,
            height='50dp',
            background_color=(0.2, 0.6, 0.9, 1)
        )
        login_btn.bind(on_press=self.login)
        form_layout.add_widget(login_btn)
        
        main_layout.add_widget(form_layout)
        
        # Status Label
        self.status_label = Label(
            text='',
            size_hint_y=None,
            height='30dp',
            color=(1, 0, 0, 1)
        )
        main_layout.add_widget(self.status_label)
        
        self.add_widget(main_layout)
    
    def login(self, instance):
        email = self.email_input.text
        password = self.password_input.text
        
        if not email or not password:
            self.status_label.text = 'Please fill in all fields'
            return
        
        self.status_label.text = 'Logging in...'
        
        # Make API call in thread to avoid blocking UI
        threading.Thread(target=self.make_login_request, args=(email, password)).start()
    
    def make_login_request(self, email, password):
        try:
            response = requests.post(f'{API_BASE_URL}/login', json={
                'email': email,
                'password': password
            }, timeout=10)
            
            Clock.schedule_once(lambda dt: self.handle_login_response(response), 0)
        except requests.exceptions.RequestException as e:
            Clock.schedule_once(lambda dt: self.handle_login_error(str(e)), 0)
    
    def handle_login_response(self, response):
        if response.status_code == 200:
            data = response.json()
            user = data['user']
            
            if user['userType'] != 'patient':
                self.status_label.text = 'Only patients can use the mobile app'
                return
            
            # Store user data and switch to dashboard
            app = App.get_running_app()
            app.current_user = user
            app.root.current = 'dashboard'
            self.status_label.text = ''
        else:
            self.status_label.text = 'Invalid email or password'
    
    def handle_login_error(self, error):
        self.status_label.text = f'Connection error: {error}'

class DashboardScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.build_ui()
    
    def build_ui(self):
        main_layout = BoxLayout(orientation='vertical', padding=20, spacing=10)
        
        # Header
        header_layout = BoxLayout(orientation='horizontal', size_hint_y=None, height='50dp')
        
        self.welcome_label = Label(
            text='Welcome!',
            font_size='20sp',
            color=(0.2, 0.6, 0.9, 1)
        )
        header_layout.add_widget(self.welcome_label)
        
        logout_btn = Button(
            text='Logout',
            size_hint_x=None,
            width='80dp',
            background_color=(0.9, 0.3, 0.3, 1)
        )
        logout_btn.bind(on_press=self.logout)
        header_layout.add_widget(logout_btn)
        
        main_layout.add_widget(header_layout)
        
        # Quick Actions
        actions_layout = GridLayout(cols=2, spacing=10, size_hint_y=None, height='120dp')
        
        # Add Health Data Button
        add_data_btn = Button(
            text='Add Health\nData',
            font_size='14sp',
            background_color=(0.3, 0.7, 0.3, 1)
        )
        add_data_btn.bind(on_press=self.show_health_form)
        actions_layout.add_widget(add_data_btn)
        
        # View Tasks Button
        view_tasks_btn = Button(
            text='View Tasks',
            font_size='14sp',
            background_color=(0.7, 0.3, 0.7, 1)
        )
        view_tasks_btn.bind(on_press=self.show_tasks)
        actions_layout.add_widget(view_tasks_btn)
        
        main_layout.add_widget(actions_layout)
        
        # Recent Data Display
        self.data_scroll = ScrollView()
        self.data_layout = BoxLayout(orientation='vertical', spacing=5, size_hint_y=None)
        self.data_layout.bind(minimum_height=self.data_layout.setter('height'))
        self.data_scroll.add_widget(self.data_layout)
        
        main_layout.add_widget(self.data_scroll)
        
        self.add_widget(main_layout)
    
    def on_enter(self):
        # Update welcome message and load data when screen is entered
        app = App.get_running_app()
        if hasattr(app, 'current_user'):
            self.welcome_label.text = f"Welcome, {app.current_user['fullName']}!"
            self.load_recent_data()
    
    def load_recent_data(self):
        app = App.get_running_app()
        if not hasattr(app, 'current_user'):
            return
        
        user_id = app.current_user['_id']
        threading.Thread(target=self.fetch_health_data, args=(user_id,)).start()
    
    def fetch_health_data(self, user_id):
        try:
            response = requests.get(f'{API_BASE_URL}/health-data/{user_id}', timeout=10)
            if response.status_code == 200:
                data = response.json()
                Clock.schedule_once(lambda dt: self.display_health_data(data), 0)
        except requests.exceptions.RequestException:
            Clock.schedule_once(lambda dt: self.display_error("Failed to load health data"), 0)
    
    def display_health_data(self, data):
        self.data_layout.clear_widgets()
        
        if not data:
            self.data_layout.add_widget(Label(
                text='No health data recorded yet',
                size_hint_y=None,
                height='30dp'
            ))
            return
        
        # Display recent 5 entries
        for entry in data[:5]:
            entry_layout = BoxLayout(
                orientation='vertical',
                size_hint_y=None,
                height='80dp',
                padding=5
            )
            
            date = datetime.fromisoformat(entry['date'].replace('Z', '+00:00')).strftime('%Y-%m-%d')
            entry_layout.add_widget(Label(
                text=f"Date: {date}",
                font_size='14sp',
                size_hint_y=None,
                height='20dp'
            ))
            
            details = f"HR: {entry.get('heartRate', 'N/A')} | Weight: {entry.get('weight', 'N/A')}kg | Sleep: {entry.get('sleep', 'N/A')}h"
            entry_layout.add_widget(Label(
                text=details,
                font_size='12sp',
                size_hint_y=None,
                height='20dp'
            ))
            
            self.data_layout.add_widget(entry_layout)
    
    def display_error(self, message):
        self.data_layout.clear_widgets()
        self.data_layout.add_widget(Label(
            text=message,
            size_hint_y=None,
            height='30dp',
            color=(1, 0, 0, 1)
        ))
    
    def show_health_form(self, instance):
        app = App.get_running_app()
        app.root.current = 'health_form'
    
    def show_tasks(self, instance):
        app = App.get_running_app()
        app.root.current = 'tasks'
    
    def logout(self, instance):
        app = App.get_running_app()
        app.current_user = None
        app.root.current = 'login'

class HealthFormScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.build_ui()
    
    def build_ui(self):
        main_layout = BoxLayout(orientation='vertical', padding=20, spacing=10)
        
        # Header
        header = BoxLayout(orientation='horizontal', size_hint_y=None, height='50dp')
        
        back_btn = Button(
            text='< Back',
            size_hint_x=None,
            width='80dp'
        )
        back_btn.bind(on_press=self.go_back)
        header.add_widget(back_btn)
        
        title = Label(text='Add Health Data', font_size='18sp')
        header.add_widget(title)
        
        main_layout.add_widget(header)
        
        # Form
        scroll = ScrollView()
        form_layout = GridLayout(cols=1, spacing=10, size_hint_y=None, padding=10)
        form_layout.bind(minimum_height=form_layout.setter('height'))
        
        # Health metrics inputs
        self.inputs = {}
        metrics = [
            ('Heart Rate (bpm)', 'heartRate'),
            ('Blood Pressure', 'bloodPressure'),
            ('Weight (kg)', 'weight'),
            ('Sleep (hours)', 'sleep'),
            ('Blood Glucose (mg/dL)', 'glucose'),
            ('Steps', 'steps'),
            ('Water (liters)', 'water')
        ]
        
        for label_text, key in metrics:
            form_layout.add_widget(Label(
                text=label_text,
                size_hint_y=None,
                height='30dp'
            ))
            
            input_field = TextInput(
                multiline=False,
                size_hint_y=None,
                height='40dp'
            )
            self.inputs[key] = input_field
            form_layout.add_widget(input_field)
        
        # Notes
        form_layout.add_widget(Label(
            text='Notes (optional)',
            size_hint_y=None,
            height='30dp'
        ))
        self.notes_input = TextInput(
            multiline=True,
            size_hint_y=None,
            height='80dp'
        )
        form_layout.add_widget(self.notes_input)
        
        # Submit Button
        submit_btn = Button(
            text='Save Health Data',
            size_hint_y=None,
            height='50dp',
            background_color=(0.3, 0.7, 0.3, 1)
        )
        submit_btn.bind(on_press=self.submit_data)
        form_layout.add_widget(submit_btn)
        
        # Status
        self.status_label = Label(
            text='',
            size_hint_y=None,
            height='30dp'
        )
        form_layout.add_widget(self.status_label)
        
        scroll.add_widget(form_layout)
        main_layout.add_widget(scroll)
        
        self.add_widget(main_layout)
    
    def submit_data(self, instance):
        app = App.get_running_app()
        if not hasattr(app, 'current_user'):
            return
        
        # Collect form data
        data = {
            'userId': app.current_user['_id'],
            'date': datetime.now().isoformat(),
            'notes': self.notes_input.text
        }
        
        # Add numeric fields
        for key, input_field in self.inputs.items():
            value = input_field.text.strip()
            if value:
                if key == 'bloodPressure':
                    data[key] = value
                else:
                    try:
                        data[key] = float(value)
                    except ValueError:
                        self.status_label.text = f'Invalid value for {key}'
                        self.status_label.color = (1, 0, 0, 1)
                        return
        
        self.status_label.text = 'Saving...'
        self.status_label.color = (0, 0, 1, 1)
        
        threading.Thread(target=self.save_health_data, args=(data,)).start()
    
    def save_health_data(self, data):
        try:
            response = requests.post(f'{API_BASE_URL}/health-data', json=data, timeout=10)
            if response.status_code == 201:
                Clock.schedule_once(lambda dt: self.handle_save_success(), 0)
            else:
                Clock.schedule_once(lambda dt: self.handle_save_error('Failed to save data'), 0)
        except requests.exceptions.RequestException as e:
            Clock.schedule_once(lambda dt: self.handle_save_error(str(e)), 0)
    
    def handle_save_success(self):
        self.status_label.text = 'Data saved successfully!'
        self.status_label.color = (0, 1, 0, 1)
        
        # Clear form
        for input_field in self.inputs.values():
            input_field.text = ''
        self.notes_input.text = ''
        
        # Auto-navigate back after 2 seconds
        Clock.schedule_once(lambda dt: self.go_back(None), 2)
    
    def handle_save_error(self, error):
        self.status_label.text = f'Error: {error}'
        self.status_label.color = (1, 0, 0, 1)
    
    def go_back(self, instance):
        app = App.get_running_app()
        app.root.current = 'dashboard'

class TasksScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.build_ui()
    
    def build_ui(self):
        main_layout = BoxLayout(orientation='vertical', padding=20, spacing=10)
        
        # Header
        header = BoxLayout(orientation='horizontal', size_hint_y=None, height='50dp')
        
        back_btn = Button(
            text='< Back',
            size_hint_x=None,
            width='80dp'
        )
        back_btn.bind(on_press=self.go_back)
        header.add_widget(back_btn)
        
        title = Label(text='My Tasks', font_size='18sp')
        header.add_widget(title)
        
        main_layout.add_widget(header)
        
        # Tasks List
        self.tasks_scroll = ScrollView()
        self.tasks_layout = BoxLayout(orientation='vertical', spacing=5, size_hint_y=None)
        self.tasks_layout.bind(minimum_height=self.tasks_layout.setter('height'))
        self.tasks_scroll.add_widget(self.tasks_layout)
        
        main_layout.add_widget(self.tasks_scroll)
        
        self.add_widget(main_layout)
    
    def on_enter(self):
        self.load_tasks()
    
    def load_tasks(self):
        app = App.get_running_app()
        if not hasattr(app, 'current_user'):
            return
        
        user_id = app.current_user['_id']
        threading.Thread(target=self.fetch_tasks, args=(user_id,)).start()
    
    def fetch_tasks(self, user_id):
        try:
            response = requests.get(f'{API_BASE_URL}/tasks/{user_id}', timeout=10)
            if response.status_code == 200:
                tasks = response.json()
                Clock.schedule_once(lambda dt: self.display_tasks(tasks), 0)
        except requests.exceptions.RequestException:
            Clock.schedule_once(lambda dt: self.display_error("Failed to load tasks"), 0)
    
    def display_tasks(self, tasks):
        self.tasks_layout.clear_widgets()
        
        if not tasks:
            self.tasks_layout.add_widget(Label(
                text='No tasks assigned yet',
                size_hint_y=None,
                height='30dp'
            ))
            return
        
        for task in tasks:
            task_layout = BoxLayout(
                orientation='horizontal',
                size_hint_y=None,
                height='60dp',
                padding=5,
                spacing=10
            )
            
            # Task info
            info_layout = BoxLayout(orientation='vertical', size_hint_x=0.8)
            info_layout.add_widget(Label(
                text=task['task'],
                font_size='14sp',
                size_hint_y=None,
                height='25dp'
            ))
            
            assigned_date = datetime.fromisoformat(task['assignedDate'].replace('Z', '+00:00')).strftime('%Y-%m-%d')
            info_layout.add_widget(Label(
                text=f"Assigned: {assigned_date}",
                font_size='10sp',
                size_hint_y=None,
                height='15dp',
                color=(0.5, 0.5, 0.5, 1)
            ))
            
            task_layout.add_widget(info_layout)
            
            # Status button
            status_btn = Button(
                text='✓' if task['completed'] else '○',
                size_hint_x=0.2,
                background_color=(0.3, 0.7, 0.3, 1) if task['completed'] else (0.7, 0.7, 0.7, 1)
            )
            if not task['completed']:
                status_btn.bind(on_press=lambda x, t=task: self.mark_completed(t))
            
            task_layout.add_widget(status_btn)
            self.tasks_layout.add_widget(task_layout)
    
    def mark_completed(self, task):
        threading.Thread(target=self.update_task_status, args=(task['_id'],)).start()
    
    def update_task_status(self, task_id):
        try:
            response = requests.put(f'{API_BASE_URL}/tasks/{task_id}', 
                                    json={'completed': True}, timeout=10)
            if response.status_code == 200:
                Clock.schedule_once(lambda dt: self.load_tasks(), 0)
        except requests.exceptions.RequestException:
            pass
    
    def display_error(self, message):
        self.tasks_layout.clear_widgets()
        self.tasks_layout.add_widget(Label(
            text=message,
            size_hint_y=None,
            height='30dp',
            color=(1, 0, 0, 1)
        ))
    
    def go_back(self, instance):
        app = App.get_running_app()
        app.root.current = 'dashboard'

class VitalSyncApp(App):
    def build(self):
        # Screen Manager
        sm = ScreenManager()
        
        # Add screens
        sm.add_widget(LoginScreen(name='login'))
        sm.add_widget(DashboardScreen(name='dashboard'))
        sm.add_widget(HealthFormScreen(name='health_form'))
        sm.add_widget(TasksScreen(name='tasks'))
        
        return sm

if __name__ == '__main__':
    VitalSyncApp().run()