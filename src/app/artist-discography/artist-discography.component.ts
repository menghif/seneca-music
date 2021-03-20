import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css'],
})
export class ArtistDiscographyComponent implements OnInit {
  albums: {};
  artist: {};
  paramSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private musicData: MusicDataService
  ) {}
  1;
  ngOnInit(): void {
    this.paramSubscription = this.route.params.subscribe(
      (params: Params) => (
        this.musicData
          .getArtistById(params.id)
          .subscribe((data) => (this.artist = data)),
        this.musicData.getAlbumsByArtistId(params.id).subscribe(
          (data) =>
            (this.albums = data.items.filter(
              // remove duplicates
              (album, index, array) =>
                index === array.findIndex((el) => el.name === album.name)
            ))
        )
      )
    );
  }
}
