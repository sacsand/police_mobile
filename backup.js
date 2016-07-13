</ion-card>
</ion-content>
</ion-view>

<ion-view view-title="Ionic Components+">
  <ion-content>

    <div class="im-wrapper">

      <!-- Icon List -->
      <h4 class="border-top"><i class="icon ion-nuclear"></i> Icon List</h4>
      <div class="list">
        <a class="item item-icon-left">
          <i class="icon ion-email"></i> Check mail
        </a>
        <a class="item item-icon-left">
          <i class="icon ion-mic-a"></i> Record album
          <span class="item-note">
            Grammy
        </span>
        </a>
        <a class="item item-icon-left">
          <i class="icon ion-person-stalker"></i> Friends
          <span class="badge badge-assertive" ng-repeat="detail in details">{{detail.height}}</span>
        </a>
      </div>
      <div class="code-wrapper">
        <a class="toggle">View Code</a>
        <div class="code">
          &lt;div class="list"&gt; &lt;a class="item item-icon-left" &gt; &lt;i class="icon ion-email"&gt;&lt;/i&gt; Check mail &lt;/a&gt; &lt;a class="item item-icon-left" &gt; &lt;i class="icon ion-mic-a"&gt;&lt;/i&gt; Record album &lt;span class="item-note"&gt;
          Grammy &lt;/span&gt; &lt;/a&gt; &lt;a class="item item-icon-left" &gt; &lt;i class="icon ion-person-stalker"&gt;&lt;/i&gt; Friends &lt;span class="badge badge-assertive"&gt;0&lt;/span&gt; &lt;/a&gt; &lt;/div&gt;
        </div>
      </div>

    </div>
  </ion-content>
</ion-view>




<ion-view view-title="WantedSingle">
  <ion-content class="cards-bg" >
     <ion-card>
        <ion-card-content>
      <h2 class="card-title" ng-repeat="wanted in wanteds.doc">
        {{wanted.warent}}
     </h2>
     <p>
        Björk first came to prominence as one of the lead vocalists of the avant pop Icelandic sextet the Sugarcubes, but when...
      </p>
   </ion-card-content>

   <ion-item >
     <ion-icon name='musical-notes' item-left style="color: #d03e84"></ion-icon>
     Height
     <ion-badge item-right ng-repeat="detail in details">  {{detail.height}}</ion-badge>
   </ion-item>

   <ion-item >
     <ion-icon name='musical-notes' item-left style="color: #d03e84"></ion-icon>
     Height
     <ion-badge item-right ng-repeat="detail in details">  {{detail.height}}</ion-badge>
   </ion-item>



  </ion-card>
  </ion-content>
</ion-view>
