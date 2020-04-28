import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '../../services/http/http.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  public title: string = '';
  public photo: string = '';
  public tags: string = '';
  public content: string = '';
  public id: string = null;
  public loading: boolean = false;
  constructor(private router: Router, private activetedRoute: ActivatedRoute, private http: Http, private snackbar: MatSnackBar) { }

  ngOnInit() {
    document.onkeyup = (event) => {
      if (event.keyCode == 27) this.close();
    }
    if (window.location.pathname != '/post/new') this.fetch();
  }
  ngOnDestroy() {
    document.onkeyup = null;
  }

  close() {
    this.router.navigate(['/post']);
  }

  fetch() {
    this.loading = true;
    this.activetedRoute.params.subscribe(param => {
      let id = param['id'];
      this.http.grapql('main', `{ post(id:"${id}") { title photo content tags } }`).then((res: any) => {
        this.loading = false;
        let data = res['data']['post'];
        this.title = data['title'];
        this.photo = data['photo'];
        this.content = data['content'];
        this.tags = data['tags'];
        this.id = id;
      }).catch(() => {
        this.loading = false;
        this.snackbar.open('خطا در ارتباط با سرور', 'باشه', { duration: 4000, direction: 'rtl' });
      })
    });
  }

  submit() {
    let title = this.title,
      photo = this.photo,
      tags = this.tags,
      content = this.content;

    if (title.length == 0) this.snackbar.open('عنوان نوشته را وارد نکرده اید.', 'باشه', { duration: 4000, direction: 'rtl' });
    else if (photo.length == 0) this.snackbar.open('آدرس تصویر نوشته را وارد نکرده اید.', 'باشه', { duration: 4000, direction: 'rtl' });
    else if (tags.length == 0) this.snackbar.open('برجسب های نوشته را وارد نکرده اید.', 'باشه', { duration: 4000, direction: 'rtl' });
    else if (content.length == 0) this.snackbar.open('محتوا ی نوشته را وارد نکرده اید.', 'باشه', { duration: 4000, direction: 'rtl' });
    else {
      this.loading = true;
      let object = { title, photo, tags, content };
      if (this.id) object['id'] = this.id;
      let method = (this.id) ? 'PUT' : 'POST';
      this.http.request('main', '/api/database/post', method, object, true)
        .then((res: any) => {
          this.loading = false;
          this.snackbar.open(res['message'], 'باشه', { duration: 4000, direction: 'rtl' });
          if (res['status'] == true) this.close()
        }).catch(() => {
          this.loading = false;
          this.snackbar.open('خطا در ارتباط با سرور', 'باشه', { duration: 4000, direction: 'rtl' });
        })
    }
  }
}