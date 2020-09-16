import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { stringify } from "querystring";
import { CRUDService } from "../crud.service";
import { Post } from "../post";

@Component({
  selector: "app-createpost",
  templateUrl: "./createpost.component.html",
  styleUrls: ["./createpost.component.css"],
})
export class CreatepostComponent implements OnInit {
  constructor(public service: CRUDService, public route: ActivatedRoute) {}

  public postTitle: string;
  public postContent: string;
  public posts: Post[] = [];
  public mode = "create";
  private postId: string;

  ngOnInit() {
    //console.log(this.service.postDetails);
    // if (this.service.postDetails) {
    //   this.mode = "edit";
    //   console.log("Post Details from Service");
    //   this.postId = this.service.postDetails.id;
    //   this.postTitle = this.service.postDetails.title;
    //   this.postContent = this.service.postDetails.content;
    // } else {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log("Post Details from Database");
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        //console.log(this.postId);
        this.service.getPost(this.postId).subscribe((result) => {
          //console.log(result);
          this.postTitle = result.title;
          this.postContent = result.content;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
    //this.service.postDetails = { id:null,title:null,content:null }
    // this.service.postDetails.id = null;
    // this.mode = "create";
    // this.postId = null;
  }

  onSavePost() {
    console.log(this.mode);
    if (this.mode === "create") {
      //console.log("add post");
      const post: Post = {
        id: "null",
        title: this.postTitle,
        content: this.postContent,
      };
      this.service.addPost(post).subscribe((responseData) => {
        //console.log(responseData);
        post.id = responseData.CreatedPostId;
        this.posts.push(post);
        console.log(this.posts);
        this.postTitle = "";
        this.postContent = "";
      });
    } else {
      console.log("update post");
      this.service
        .updatePost(this.postId, this.postTitle, this.postContent)
        .subscribe((result) => {
          console.log(result);
        });
    }
  }
}
