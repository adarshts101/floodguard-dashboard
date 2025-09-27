package com.adarsh.floodguard;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class MainActivity extends AppCompatActivity {

    private TextView tvDistance, tvWater, tvAlert, tvLastUpdate, tvEmptyLogs;
    private LinearLayout logContainer;
    private DatabaseReference databaseRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tvDistance = findViewById(R.id.tvDistanceValue);
        tvWater = findViewById(R.id.tvWaterValue);
        tvAlert = findViewById(R.id.tvAlertStatus);
        tvLastUpdate = findViewById(R.id.tvLastUpdate);
        logContainer = findViewById(R.id.logContainer);
        tvEmptyLogs = findViewById(R.id.tvEmptyLogs);

        databaseRef = FirebaseDatabase.getInstance(
                        "https://floodguardx1-6ed9f-default-rtdb.asia-southeast1.firebasedatabase.app")
                .getReference("FloodGuard");

        databaseRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                if(snapshot.exists()){
                    final Long distance = snapshot.child("distance").getValue(Long.class);
                    final Long water = snapshot.child("waterValue").getValue(Long.class);
                    final String alert = snapshot.child("alert").getValue(String.class);

                    runOnUiThread(() -> {
                        tvDistance.setText(distance + " cm");
                        tvWater.setText(String.valueOf(water));
                        tvAlert.setText(alert);
                        tvLastUpdate.setText("Last updated: " + java.text.DateFormat.getDateTimeInstance().format(new java.util.Date()));
                    });

                    logContainer.removeAllViews();
                    boolean hasLogs = false;
                    for (DataSnapshot logSnapshot : snapshot.child("logs").getChildren()) {
                        String message = logSnapshot.child("message").getValue(String.class);
                        if(message != null){
                            TextView logView = new TextView(MainActivity.this);
                            logView.setText(message);
                            logView.setPadding(0, 4, 0, 4);
                            logContainer.addView(logView);
                            hasLogs = true;
                        }
                    }

                    tvEmptyLogs.setVisibility(hasLogs ? TextView.GONE : TextView.VISIBLE);
                }
            }

            @Override
            public void onCancelled(DatabaseError error) {
                runOnUiThread(() -> tvDistance.setText("Error: " + error.getMessage()));
            }
        });
    }
}
